"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  retrieveWholeSyllabuses,
  WholeSyllabusNode,
} from "@/services/contentService";
import SubMenu from "@/components/TeacherDashboard/SubMenu";
import GeneralLoadingComponent from "@/components/CommonComponents/GeneralLoadingComponent";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface SearchResult {
  conceptId: string;
  name: string;
  type: string;
  path: string[];
}

export default function ResourceLibrary() {
  const router = useRouter();
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

        console.log("✅ Syllabuses fetched successfully:", response);
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

  // Search functionality
  const searchInTree = (
    nodes: WholeSyllabusNode[],
    query: string,
    path: string[] = []
  ): SearchResult[] => {
    let results: SearchResult[] = [];

    nodes.forEach((node) => {
      const currentPath = [...path, node.name];

      if (node.name.toLowerCase().includes(query.toLowerCase())) {
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
  };

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
  }, [searchQuery, viewMode, syllabusByMatter, syllabusByGrade]);

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchQuery("");
    setShowSearchResults(false);

    // Navigate to particle
    if (result.type === "Particle") {
      router.push(
        `/dashboard/@student/concept-view?conceptId=${result.conceptId}`
      );
      return;
    }

    // Set appropriate selections based on type
    if (viewMode === "matter") {
      const targetId = result.conceptId;

      // Find the hierarchy
      syllabusByMatter.forEach((matter) => {
        const findInMatter = (
          node: WholeSyllabusNode,
          searchTargetId: string
        ): boolean => {
          if (node.conceptId === searchTargetId) return true;

          if (node.children) {
            for (const child of node.children) {
              if (findInMatter(child, searchTargetId)) {
                if (child.type === "Atom") {
                  setSelectedMatter(matter.conceptId);
                  setSelectedMolecule(node.conceptId);
                  setSelectedAtom(child.conceptId);
                  return true;
                } else if (child.type === "Molecule") {
                  setSelectedMatter(matter.conceptId);
                  setSelectedMolecule(child.conceptId);
                  setSelectedAtom("");
                  return true;
                }
              }
            }
          }
          return false;
        };

        if (matter.conceptId === targetId) {
          setSelectedMatter(matter.conceptId);
          setSelectedMolecule("");
          setSelectedAtom("");
        } else {
          findInMatter(matter, targetId);
        }
      });
    } else {
      const targetId = result.conceptId;

      // For grade view, topic click navigates to concept-view
      if (result.type === "Topic") {
        router.push(
          `/dashboard/@student/concept-view?conceptId=${result.conceptId}`
        );
      } else {
        syllabusByGrade.forEach((grade) => {
          if (grade.conceptId === targetId) {
            setSelectedGrade(grade.conceptId);
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
    } else {
      setSelectedMolecule(moleculeId);
      setSelectedAtom("");
    }
  };

  const handleAtomClick = (atomId: string) => {
    if (selectedAtom === atomId) {
      setSelectedAtom("");
    } else {
      setSelectedAtom(atomId);
    }
  };

  const handleParticleClick = (conceptId: string) => {
    router.push(`/dashboard/@student/concept-view?conceptId=${conceptId}`);
  };

  const handleTopicClick = (conceptId: string) => {
    router.push(`/dashboard/@student/concept-view?conceptId=${conceptId}`);
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
    <div className="min-h-screen bg-white">
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header section */}
          <header className="mb-8 mt-20">
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
                          {result.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.path.join(" > ")}
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
                  <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6">
                    <h3 className="text-sm font-semibold text-purple-700 mb-4">
                      Sections
                    </h3>
                    <div className="space-y-2">
                      {syllabusByMatter.map((matter) => (
                        <button
                          key={matter.conceptId}
                          onClick={() => {
                            setSelectedMatter(matter.conceptId);
                            setSelectedMolecule("");
                            setSelectedAtom("");
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                            selectedMatter === matter.conceptId
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <p className="font-semibold text-sm">{matter.name}</p>
                          <p className="text-xs opacity-80 mt-1">
                            {matter.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                  <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8">
                    {!selectedAtom ? (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-purple-700">
                              {getCurrentMatter()?.name || "Select a Matter"}
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
                                    {molecule.name}
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
                                      onClick={() =>
                                        handleAtomClick(atom.conceptId)
                                      }
                                      className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors border border-gray-200"
                                    >
                                      <p className="font-medium text-gray-800">
                                        {atom.name}
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
                                    {atom?.name}
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
                                  <button
                                    key={particle.conceptId}
                                    onClick={() =>
                                      handleParticleClick(particle.conceptId)
                                    }
                                    className="w-full text-left px-6 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200"
                                  >
                                    <p className="font-semibold text-gray-800">
                                      {particle.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {particle.description}
                                    </p>
                                  </button>
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
                  <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-6">
                    <h3 className="text-sm font-semibold text-purple-700 mb-4">
                      Grades
                    </h3>
                    <div className="space-y-2">
                      {syllabusByGrade.map((grade) => (
                        <button
                          key={grade.conceptId}
                          onClick={() => setSelectedGrade(grade.conceptId)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                            selectedGrade === grade.conceptId
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <p className="font-semibold text-sm">{grade.name}</p>
                          <p className="text-xs opacity-80 mt-1">
                            {grade.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                  <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg p-8">
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-purple-700">
                          {getCurrentGrade()?.name || "Select a Grade"}
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
                          onClick={() => handleTopicClick(topic.conceptId)}
                          className="text-left px-6 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200"
                        >
                          <p className="font-semibold text-gray-800">
                            {topic.name}
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
    </div>
  );
}
