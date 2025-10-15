"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  retrieveWholeSyllabuses,
  WholeSyllabusNode,
} from "@/services/contentService";
import SubMenu from "@/components/TeacherDashboard/SubMenu";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
import { Search, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";

interface SearchResult {
  conceptId: string;
  name: string;
  type: string;
  path: string[];
}

// Helper function to remove code from name (e.g., "Algebra (MAT003)" -> "Algebra")
const cleanName = (name: string): string => {
  return name.replace(/\s*\([^)]*\)\s*$/g, "").trim();
};

// Helper function to capitalize first letter
const capitalizeFirst = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Helper function to format particle names (remove hyphens and capitalize)
const formatParticleName = (name: string): string => {
  const cleaned = cleanName(name);
  // Replace hyphens with spaces and capitalize each word
  return cleaned
    .split("-")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

// Helper function to format grade names (add space between Grade and number)
const formatGradeName = (name: string): string => {
  const cleaned = cleanName(name);
  // Add space between "Grade" and the number (e.g., "Grade10" -> "Grade 10")
  return cleaned.replace(/^(Grade)(\d+)/i, "$1 $2");
};

export default function ResourceLibrary() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [syllabusByMatter, setSyllabusByMatter] = useState<WholeSyllabusNode[]>(
    []
  );
  const [syllabusByGrade, setSyllabusByGrade] = useState<WholeSyllabusNode[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<"matter" | "grade">("matter");

  // Selection state
  const [selectedMatter, setSelectedMatter] = useState<string>("");
  const [selectedMolecule, setSelectedMolecule] = useState<string>("");
  const [selectedAtom, setSelectedAtom] = useState<string>("");
  const [selectedParticle, setSelectedParticle] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const fetchWholeSyllabuses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await retrieveWholeSyllabuses();

        setSyllabusByMatter(response.syllabusByMatter);
        setSyllabusByGrade(response.syllabusByGrade);

        // Set initial selections
        if (response.syllabusByMatter.length > 0) {
          setSelectedMatter(response.syllabusByMatter[0].conceptId);
        }
        if (response.syllabusByGrade.length > 0) {
          setSelectedGrade(response.syllabusByGrade[0].conceptId);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch syllabuses";
        setError(errorMessage);
        console.error("❌ Error fetching syllabuses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWholeSyllabuses();
  }, []);

  // Search functionality - searches in cleaned names
  const searchInTree = useCallback(
    (
      nodes: WholeSyllabusNode[],
      query: string,
      path: string[] = []
    ): SearchResult[] => {
      let results: SearchResult[] = [];

      nodes.forEach((node) => {
        const currentPath = [...path, node.name];
        const cleanedName = cleanName(node.name);
        const cleanedDescription = node.description || "";

        if (
          cleanedName.toLowerCase().includes(query.toLowerCase()) ||
          cleanedDescription.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            conceptId: node.conceptId,
            name: node.name,
            type: node.type,
            path: currentPath,
          });
        }

        if (node.children && node.children.length > 0) {
          results = [
            ...results,
            ...searchInTree(node.children, query, currentPath),
          ];
        }
      });

      return results;
    },
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      const allData =
        viewMode === "matter" ? syllabusByMatter : syllabusByGrade;
      const results = searchInTree(allData, searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, viewMode, syllabusByMatter, syllabusByGrade, searchInTree]);

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchQuery("");
    setShowSearchResults(false);

    // Set appropriate selections based on type
    if (viewMode === "matter") {
      const targetId = result.conceptId;

      // Find the hierarchy for any type including Particle
      syllabusByMatter.forEach((matter) => {
        const findInMatter = (
          node: WholeSyllabusNode,
          searchTargetId: string,
          parentMolecule?: WholeSyllabusNode,
          parentAtom?: WholeSyllabusNode
        ): boolean => {
          if (node.conceptId === searchTargetId) {
            if (node.type === "Particle" && parentAtom && parentMolecule) {
              // Expand and highlight particle in the right side box
              setSelectedMatter(matter.conceptId);
              setSelectedMolecule(parentMolecule.conceptId);
              setSelectedAtom(parentAtom.conceptId);
              setSelectedParticle(node.conceptId);

              // Scroll to particle after state update
              setTimeout(() => {
                const element = document.getElementById(
                  `particle-${node.conceptId}`
                );
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  element.classList.add("highlight-flash");
                  setTimeout(
                    () => element.classList.remove("highlight-flash"),
                    2000
                  );
                }
              }, 100);
              return true;
            } else if (node.type === "Atom" && parentMolecule) {
              // For atom search: expand molecule but don't navigate to atom view
              setSelectedMatter(matter.conceptId);
              setSelectedMolecule(parentMolecule.conceptId);
              setSelectedAtom(""); // Don't set selected atom to avoid showing particles
              setSelectedParticle("");

              // Scroll to atom after state update
              setTimeout(() => {
                const element = document.getElementById(
                  `atom-${node.conceptId}`
                );
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  element.classList.add("highlight-flash");
                  setTimeout(
                    () => element.classList.remove("highlight-flash"),
                    2000
                  );
                }
              }, 100);
              return true;
            } else if (node.type === "Molecule") {
              setSelectedMatter(matter.conceptId);
              setSelectedMolecule(node.conceptId);
              setSelectedAtom("");
              setSelectedParticle("");

              // Scroll to molecule after state update
              setTimeout(() => {
                const element = document.getElementById(
                  `molecule-${node.conceptId}`
                );
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  element.classList.add("highlight-flash");
                  setTimeout(
                    () => element.classList.remove("highlight-flash"),
                    2000
                  );
                }
              }, 100);
              return true;
            }
            return true;
          }

          if (node.children) {
            for (const child of node.children) {
              const currentMolecule =
                node.type === "Molecule" ? node : parentMolecule;
              const currentAtom = node.type === "Atom" ? node : parentAtom;

              if (
                findInMatter(
                  child,
                  searchTargetId,
                  currentMolecule,
                  currentAtom
                )
              ) {
                return true;
              }
            }
          }
          return false;
        };

        if (matter.conceptId === targetId) {
          setSelectedMatter(matter.conceptId);
          setSelectedMolecule("");
          setSelectedAtom("");
          setSelectedParticle("");
        } else {
          findInMatter(matter, targetId);
        }
      });
    } else {
      const targetId = result.conceptId;

      // For grade view, expand the hierarchy instead of navigating
      if (result.type === "Topic") {
        syllabusByGrade.forEach((grade) => {
          const findInGrade = (
            node: WholeSyllabusNode,
            searchTargetId: string
          ): boolean => {
            if (node.conceptId === searchTargetId) {
              setSelectedGrade(grade.conceptId);
              setSelectedTopic(node.conceptId);

              // Scroll to topic after state update
              setTimeout(() => {
                const element = document.getElementById(
                  `topic-${node.conceptId}`
                );
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  element.classList.add("highlight-flash");
                  setTimeout(
                    () => element.classList.remove("highlight-flash"),
                    2000
                  );
                }
              }, 100);
              return true;
            }

            if (node.children) {
              for (const child of node.children) {
                if (findInGrade(child, searchTargetId)) {
                  return true;
                }
              }
            }
            return false;
          };

          findInGrade(grade, targetId);
        });
      } else {
        syllabusByGrade.forEach((grade) => {
          if (grade.conceptId === targetId) {
            setSelectedGrade(grade.conceptId);
            setSelectedTopic("");
          }
        });
      }
    }
  };

  const getCurrentMatter = () => {
    return syllabusByMatter.find((m) => m.conceptId === selectedMatter);
  };

  const getCurrentGrade = () => {
    return syllabusByGrade.find((g) => g.conceptId === selectedGrade);
  };

  const handleMoleculeClick = (moleculeId: string) => {
    if (selectedMolecule === moleculeId) {
      setSelectedMolecule("");
      setSelectedAtom("");
      setSelectedParticle("");
    } else {
      setSelectedMolecule(moleculeId);
      setSelectedAtom("");
      setSelectedParticle("");
    }
  };

  const handleAtomClick = (atomId: string) => {
    if (selectedAtom === atomId) {
      setSelectedAtom("");
      setSelectedParticle("");
    } else {
      setSelectedAtom(atomId);
      setSelectedParticle("");
    }
  };

  const handleParticleClick = (particleId: string) => {
    // Navigate to concept-view page for the particle
    router.push(`/concept-view?conceptId=${particleId}`);
  };

  const handleTopicClick = (conceptId: string) => {
    router.push(`/concept-view?conceptId=${conceptId}`);
  };

  if (loading) {
    return <GeneralLoadingComponent text="Loading Learning Resources" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const viewItems = [
    {
      id: "matter",
      label: "By Matter",
      icon: "🧪",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "grade",
      label: "By Grade",
      icon: "🎓",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-8 relative">
            {/* Back Button - Positioned on the right */}
            <div className="absolute top-0 right-0">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 hover:border-purple-300/60 transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                  Back to Dashboard
                </span>
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-violet-600 bg-clip-text text-transparent">
              Learning Resources
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Explore our comprehensive curriculum organized by subject matter
              or grade level.
            </p>
          </header>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for concepts, topics, or materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 mt-2 w-full max-w-2xl bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.conceptId}-${index}`}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {result.type === "Particle"
                            ? formatParticleName(result.name)
                            : cleanName(result.name)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.path.map((p) => cleanName(p)).join(" > ")}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {result.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Selector */}
          <div className="mb-16">
            <SubMenu
              items={viewItems}
              activeItem={viewMode}
              onItemChange={(item) => {
                setViewMode(item as "matter" | "grade");
                setSelectedMolecule("");
                setSelectedAtom("");
                setSelectedParticle("");
                setSelectedTopic("");
              }}
              title="View Mode"
            />
          </div>

          {/* Content Area */}
          <div className="transition-all duration-700 ease-in-out">
            {viewMode === "matter" && (
              <div className="flex gap-6">
                {/* Sections (Matter) */}
                <div className="w-64 flex-shrink-0">
                  <div
                    className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-lg p-6 overflow-y-auto custom-scrollbar-minimal"
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                  >
                    <h3 className="text-sm font-semibold text-purple-700 mb-4">
                      Sections
                    </h3>
                    <div className="space-y-2">
                      {[...syllabusByMatter]
                        .sort((a, b) =>
                          cleanName(a.name).localeCompare(cleanName(b.name))
                        )
                        .map((matter) => (
                          <button
                            key={matter.conceptId}
                            onClick={() => {
                              setSelectedMatter(matter.conceptId);
                              setSelectedMolecule("");
                              setSelectedAtom("");
                              setSelectedParticle("");
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                              selectedMatter === matter.conceptId
                                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <p className="font-semibold text-sm">
                              {cleanName(matter.name)}
                            </p>
                            <p className="text-xs opacity-80 mt-1">
                              {matter.description}
                            </p>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Main Content Area - Fixed Height with Scroll */}
                <div className="flex-1">
                  <div
                    ref={contentRef}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-lg p-8 overflow-y-auto custom-scrollbar"
                    style={{
                      height: "calc(100vh - 150px)",
                      minHeight: "700px",
                    }}
                  >
                    {!selectedAtom && !selectedParticle ? (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-purple-700">
                              {cleanName(
                                getCurrentMatter()?.name || "Select a Matter"
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {getCurrentMatter()?.description}
                          </p>
                        </div>

                        {/* Molecules List */}
                        <div className="space-y-4">
                          {getCurrentMatter()?.children?.map((molecule) => (
                            <div
                              key={molecule.conceptId}
                              id={`molecule-${molecule.conceptId}`}
                              className="border border-gray-200 rounded-xl overflow-hidden"
                            >
                              <button
                                onClick={() =>
                                  handleMoleculeClick(molecule.conceptId)
                                }
                                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
                              >
                                <div className="text-left">
                                  <p className="font-semibold text-gray-800">
                                    {cleanName(molecule.name)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {molecule.description}
                                  </p>
                                </div>
                                {selectedMolecule === molecule.conceptId ? (
                                  <ChevronDown className="w-5 h-5 text-purple-600" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                              </button>

                              {/* Atoms List (shown when molecule is expanded) */}
                              {selectedMolecule === molecule.conceptId && (
                                <div className="bg-white p-4 space-y-2">
                                  {molecule.children?.map((atom) => (
                                    <button
                                      key={atom.conceptId}
                                      id={`atom-${atom.conceptId}`}
                                      onClick={() =>
                                        handleAtomClick(atom.conceptId)
                                      }
                                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors border ${
                                        selectedAtom === atom.conceptId
                                          ? "bg-purple-100 border-purple-300"
                                          : "bg-gray-50 hover:bg-purple-50 border-gray-200"
                                      }`}
                                    >
                                      <p className="font-medium text-gray-800">
                                        {cleanName(atom.name)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {atom.description}
                                      </p>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Atom and Particles View */}
                        {(() => {
                          const matter = getCurrentMatter();
                          const molecule = matter?.children?.find(
                            (m) => m.conceptId === selectedMolecule
                          );
                          const atom = molecule?.children?.find(
                            (a) => a.conceptId === selectedAtom
                          );

                          return (
                            <div>
                              <button
                                onClick={() => setSelectedAtom("")}
                                className="mb-6 text-purple-600 hover:text-purple-700 font-semibold flex items-center space-x-2"
                              >
                                <span>←</span>
                                <span>Back to Molecules</span>
                              </button>

                              <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                  <span className="text-sm font-semibold text-purple-700">
                                    {cleanName(atom?.name || "")}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {atom?.description}
                                </p>
                              </div>

                              {/* Particles List */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-700 mb-4">
                                  Particles
                                </h4>
                                {atom?.children?.map((particle) => (
                                  <div
                                    key={particle.conceptId}
                                    id={`particle-${particle.conceptId}`}
                                    className={`transition-all duration-300 ${
                                      selectedParticle === particle.conceptId
                                        ? "ring-2 ring-purple-400 scale-103 shadow-lg rounded-xl"
                                        : ""
                                    }`}
                                  >
                                    <button
                                      onClick={() =>
                                        handleParticleClick(particle.conceptId)
                                      }
                                      className={`w-full text-left px-6 py-4 rounded-xl transition-all border ${
                                        selectedParticle === particle.conceptId
                                          ? "bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 "
                                          : "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                                      }`}
                                    >
                                      <p className="font-semibold text-gray-800">
                                        {formatParticleName(particle.name)}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {particle.description}
                                      </p>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {viewMode === "grade" && (
              <div className="flex gap-6">
                {/* Sections (Grade) */}
                <div className="w-64 flex-shrink-0">
                  <div
                    className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-lg p-6 overflow-y-auto custom-scrollbar-minimal"
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                  >
                    <h3 className="text-sm font-semibold text-purple-700 mb-4">
                      Grades
                    </h3>
                    <div className="space-y-2">
                      {[...syllabusByGrade]
                        .sort((a, b) => {
                          // Extract numbers from grade names for proper numeric sorting
                          const getGradeNumber = (name: string) => {
                            const match = cleanName(name).match(/\d+/);
                            return match ? parseInt(match[0]) : 0;
                          };
                          return (
                            getGradeNumber(a.name) - getGradeNumber(b.name)
                          );
                        })
                        .map((grade) => (
                          <button
                            key={grade.conceptId}
                            onClick={() => setSelectedGrade(grade.conceptId)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                              selectedGrade === grade.conceptId
                                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <p className="font-semibold text-sm">
                              {formatGradeName(grade.name)}
                            </p>
                            <p className="text-xs opacity-80 mt-1">
                              {grade.description}
                            </p>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Main Content Area - Fixed Height with Scroll */}
                <div className="flex-1">
                  <div
                    className="bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-lg p-8 overflow-y-auto custom-scrollbar"
                    style={{
                      height: "calc(100vh - 150px)",
                      minHeight: "700px",
                    }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          {formatGradeName(
                            getCurrentGrade()?.name || "Select a Grade"
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getCurrentGrade()?.description}
                      </p>
                    </div>

                    {/* Topics List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getCurrentGrade()?.children?.map((topic) => (
                        <button
                          key={topic.conceptId}
                          id={`topic-${topic.conceptId}`}
                          onClick={() => handleTopicClick(topic.conceptId)}
                          className={`text-left px-6 py-4 rounded-xl transition-all border ${
                            selectedTopic === topic.conceptId
                              ? "bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 scale-102 ring-2 ring-purple-400"
                              : "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                          }`}
                        >
                          <p className="font-semibold text-gray-800">
                            {cleanName(topic.name)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {topic.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CSS for animations and custom scrollbar */}
      <style jsx>{`
        @keyframes highlightFlash {
          0%,
          100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(168, 85, 247, 0.2);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        :global(.highlight-flash) {
          animation: highlightFlash 1s ease-in-out 2;
        }

        :global(.animate-blob) {
          animation: blob 7s infinite;
        }

        :global(.animation-delay-2000) {
          animation-delay: 2s;
        }

        :global(.animation-delay-4000) {
          animation-delay: 4s;
        }

        /* Custom Scrollbar Styles - For Right Panel */
        :global(.custom-scrollbar::-webkit-scrollbar) {
          width: 10px;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-track) {
          background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
          border-radius: 10px;
          margin: 10px 0;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
          background: linear-gradient(180deg, #a855f7, #9333ea);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
          background: linear-gradient(180deg, #9333ea, #7e22ce);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        :global(.custom-scrollbar::-webkit-scrollbar-thumb:active) {
          background: linear-gradient(180deg, #7e22ce, #6b21a8);
        }

        /* Firefox Scrollbar */
        :global(.custom-scrollbar) {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 #f3f4f6;
        }

        /* Minimal Scrollbar Styles - For Left Sidebar (thumb only) */
        :global(.custom-scrollbar-minimal::-webkit-scrollbar) {
          width: 6px;
        }

        :global(.custom-scrollbar-minimal::-webkit-scrollbar-track) {
          background: transparent;
        }

        :global(.custom-scrollbar-minimal::-webkit-scrollbar-thumb) {
          background: linear-gradient(180deg, #a855f7, #9333ea);
          border-radius: 10px;
        }

        :global(.custom-scrollbar-minimal::-webkit-scrollbar-thumb:hover) {
          background: linear-gradient(180deg, #9333ea, #7e22ce);
        }

        :global(.custom-scrollbar-minimal::-webkit-scrollbar-thumb:active) {
          background: linear-gradient(180deg, #7e22ce, #6b21a8);
        }

        :global(.custom-scrollbar-minimal::-webkit-scrollbar-button) {
          display: none;
        }

        /* Firefox Minimal Scrollbar */
        :global(.custom-scrollbar-minimal) {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 transparent;
        }
      `}</style>
    </div>
  );
}
