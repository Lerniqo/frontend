"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  BookOpen,
  Award,
  Search,
  Play,
  Eye,
  ChevronRight,
  ChevronDown,
  Layers,
  Globe,
  Settings,
  Circle,
  GraduationCap,
  X,
  Atom,
  AlertTriangle,
} from "lucide-react";
import {
  retrieveSyllabuses,
  type SyllabusResponse,
  type Subject,
  type Matter,
  type Molecule,
  type Atom as AtomType,
} from "@/services/contentService";
import Loading from "@/components/CommonComponents/Loading";

// Types for expanded state management
type ExpandedState = {
  matters: Set<string>;
  molecules: Set<string>;
  atoms: Set<string>;
};

// Type for flattened search items
type SearchableItem = {
  id: string;
  name: string;
  layer: string;
  path: string[];
  parentIds: string[];
};

// Component for rendering individual tree items
interface TreeItemProps {
  id: string;
  name: string;
  layer: string;
  isExpanded: boolean;
  hasChildren: boolean;
  level: number;
  onToggle: () => void;
  onItemClick: (id: string) => void;
  onViewDetails: (id: string) => void;
  highlightItemId?: string | null;
  children?: React.ReactNode;
}

const TreeItem: React.FC<TreeItemProps> = ({
  id,
  name,
  layer,
  isExpanded,
  hasChildren,
  level,
  onToggle,
  onItemClick,
  onViewDetails,
  highlightItemId,
  children,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  const isHighlighted = highlightItemId === id;

  const getIcon = () => {
    switch (layer) {
      case "Matter":
        return <BookOpen className="text-blue-600" size={18} />;
      case "Molecule":
        return <Settings className="text-green-600" size={16} />;
      case "Atom":
        return <Atom className="text-purple-600" size={14} />;
      case "Particle":
        return <Circle className="text-orange-500" size={12} />;
      default:
        return <Layers className="text-gray-500" size={16} />;
    }
  };

  const getBackgroundColor = () => {
    switch (layer) {
      case "Matter":
        return isExpanded
          ? "bg-blue-50/10 border-blue-200/20"
          : "bg-white/5 border-gray-200/20";
      case "Molecule":
        return isExpanded
          ? "bg-green-50/10 border-green-200/20"
          : "bg-white/5 border-gray-200/20";
      case "Atom":
        return isExpanded
          ? "bg-purple-50/10 border-purple-200/20"
          : "bg-white/5 border-gray-200/20";
      case "Particle":
        return "bg-orange-50/10 border-orange-200/20";
      default:
        return "bg-white/5 border-gray-200/20";
    }
  };

  useEffect(() => {
    if (childrenRef.current) {
      if (isExpanded) {
        gsap.fromTo(
          childrenRef.current,
          {
            height: 0,
            opacity: 0,
            overflow: "hidden",
          },
          {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              if (childrenRef.current) {
                childrenRef.current.style.overflow = "visible";
              }
            },
          }
        );
      } else {
        gsap.to(childrenRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (childrenRef.current) {
              childrenRef.current.style.overflow = "hidden";
            }
          },
        });
      }
    }
  }, [isExpanded]);

  const handleClick = () => {
    if (hasChildren) {
      onToggle();

      // Add click animation
      if (itemRef.current) {
        gsap.to(itemRef.current, {
          scale: 0.98,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
    } else {
      // If no children, this is a leaf node - navigate to concept page
      onItemClick(id);
    }
  };

  return (
    <div className="w-full" id={`tree-item-${id}`}>
      <div
        ref={itemRef}
        className={`
          flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 mb-2
          ${getBackgroundColor()}
          ${
            isHighlighted
              ? "ring-4 ring-blue-400/50 bg-blue-500/20 shadow-lg scale-105"
              : ""
          }
          cursor-pointer hover:bg-white/10 transform-gpu
        `}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown
                className="text-slate-400 transition-transform duration-200"
                size={14}
              />
            ) : (
              <ChevronRight
                className="text-slate-400 transition-transform duration-200"
                size={14}
              />
            )}
          </div>
        )}

        {!hasChildren && (
          <div className="flex-shrink-0">
            <Play className="text-slate-400" size={12} />
          </div>
        )}

        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="flex-grow min-w-0">
          <span
            className={`
            font-medium text-sm
            ${layer === "Matter" ? "text-blue-300" : ""}
            ${layer === "Molecule" ? "text-green-300" : ""}
            ${layer === "Atom" ? "text-purple-300" : ""}
            ${layer === "Particle" ? "text-orange-300" : ""}
            text-white
          `}
          >
            {name}
          </span>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <span
            className={`
            text-xs px-2 py-1 rounded-full
            ${layer === "Matter" ? "bg-blue-500/20 text-blue-300" : ""}
            ${layer === "Molecule" ? "bg-green-500/20 text-green-300" : ""}
            ${layer === "Atom" ? "bg-purple-500/20 text-purple-300" : ""}
            ${layer === "Particle" ? "bg-orange-500/20 text-orange-300" : ""}
          `}
          >
            {layer}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(id);
            }}
            className="p-1 text-slate-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors duration-200"
            title="View Details"
          >
            <Eye size={12} />
          </button>

          {!hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onItemClick(id);
              }}
              className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors duration-200"
              title="Start Learning"
            >
              <GraduationCap size={14} />
            </button>
          )}
        </div>
      </div>

      {hasChildren && (
        <div
          ref={childrenRef}
          className="overflow-hidden"
          style={{ height: isExpanded ? "auto" : 0 }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface LessonLibraryManagerProps {
  onConceptClick?: (conceptId: string) => void;
}

const LessonLibraryManager: React.FC<LessonLibraryManagerProps> = ({
  onConceptClick,
}) => {
  const router = useRouter();
  const [syllabusData, setSyllabusData] = useState<SyllabusResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedState, setExpandedState] = useState<ExpandedState>({
    matters: new Set<string>(),
    molecules: new Set<string>(),
    atoms: new Set<string>(),
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allSearchableItems, setAllSearchableItems] = useState<
    SearchableItem[]
  >([]);
  const [highlightItemId, setHighlightItemId] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true);
        const data = await retrieveSyllabuses();
        setSyllabusData(data);

        // Build searchable items
        const searchableItems = buildSearchableItems(data.hierarchy);
        setAllSearchableItems(searchableItems);

        setError(null);
      } catch (err) {
        setError("Failed to load syllabus data. Please try again.");
        console.error("Error fetching syllabus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  // Build flattened searchable items from hierarchy
  const buildSearchableItems = (subject: Subject): SearchableItem[] => {
    const items: SearchableItem[] = [];

    const processNode = (
      node: Subject | Matter | Molecule | AtomType,
      path: string[] = [],
      parentIds: string[] = []
    ) => {
      const currentPath = [...path, node.name];
      const currentParentIds = [...parentIds];

      items.push({
        id: node.id,
        name: node.name,
        layer: node.layer,
        path: currentPath,
        parentIds: currentParentIds,
      });

      if ("children" in node && node.children) {
        node.children.forEach((child) => {
          processNode(child, currentPath, [...currentParentIds, node.id]);
        });
      }

      if ("particles" in node && node.particles) {
        node.particles.forEach((particle) => {
          items.push({
            id: particle.id,
            name: particle.name,
            layer: "Particle",
            path: [...currentPath, particle.name],
            parentIds: [...currentParentIds, node.id],
          });
        });
      }
    };

    processNode(subject);
    return items;
  };

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allSearchableItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.path.some((p) => p.toLowerCase().includes(query))
      )
      .slice(0, 10); // Limit to 10 results

    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchQuery, allSearchableItems]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle escape key to close search
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!loading && syllabusData) {
      // Animate container entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [loading, syllabusData]);

  const handleItemClick = (id: string) => {
    if (onConceptClick) {
      onConceptClick(id);
    } else {
      router.push(`/concept-page?conceptId=${id}`);
    }
  };

  const handleViewDetails = (id: string) => {
    if (onConceptClick) {
      onConceptClick(id);
    } else {
      router.push(`/concept-page?conceptId=${id}`);
    }
  };

  const handleSearchItemClick = (item: SearchableItem) => {
    setIsExpanding(true);

    // Clear search
    setSearchQuery("");
    setShowSearchResults(false);

    // Expand all parent nodes
    setExpandedState((prevState) => {
      const newState = {
        matters: new Set(prevState.matters),
        molecules: new Set(prevState.molecules),
        atoms: new Set(prevState.atoms),
      };

      // Expand all parent nodes based on parentIds
      item.parentIds.forEach((parentId) => {
        const parentItem = allSearchableItems.find((i) => i.id === parentId);
        if (parentItem) {
          switch (parentItem.layer) {
            case "Matter":
              newState.matters.add(parentId);
              break;
            case "Molecule":
              newState.molecules.add(parentId);
              break;
            case "Atom":
              newState.atoms.add(parentId);
              break;
          }
        }
      });

      return newState;
    });

    // Set highlight for the item
    setHighlightItemId(item.id);

    // Wait for DOM to update, then scroll
    setTimeout(() => {
      const element = document.getElementById(`tree-item-${item.id}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Remove highlight after a few seconds
        setTimeout(() => {
          setHighlightItemId(null);
          setIsExpanding(false);
        }, 3000);
      } else {
        setIsExpanding(false);
      }
    }, 600);
  };

  const toggleMatter = (matterId: string) => {
    setExpandedState((prev) => ({
      ...prev,
      matters: prev.matters.has(matterId)
        ? new Set([...prev.matters].filter((id) => id !== matterId))
        : new Set([...prev.matters, matterId]),
    }));
  };

  const toggleMolecule = (moleculeId: string) => {
    setExpandedState((prev) => ({
      ...prev,
      molecules: prev.molecules.has(moleculeId)
        ? new Set([...prev.molecules].filter((id) => id !== moleculeId))
        : new Set([...prev.molecules, moleculeId]),
    }));
  };

  const toggleAtom = (atomId: string) => {
    setExpandedState((prev) => ({
      ...prev,
      atoms: prev.atoms.has(atomId)
        ? new Set([...prev.atoms].filter((id) => id !== atomId))
        : new Set([...prev.atoms, atomId]),
    }));
  };

  const renderParticles = (atom: AtomType) => {
    return atom.particles.map((particle, _index) => (
      <TreeItem
        key={particle.id}
        id={particle.id}
        name={particle.name}
        layer="Particle"
        isExpanded={false}
        hasChildren={false}
        level={3}
        onToggle={() => {}}
        onItemClick={handleItemClick}
        onViewDetails={handleViewDetails}
        highlightItemId={highlightItemId}
      />
    ));
  };

  const renderAtoms = (molecule: Molecule) => {
    return molecule.children.map((atom, _index) => (
      <TreeItem
        key={atom.id}
        id={atom.id}
        name={atom.name}
        layer={atom.layer}
        isExpanded={expandedState.atoms.has(atom.id)}
        hasChildren={atom.particles.length > 0}
        level={2}
        onToggle={() => toggleAtom(atom.id)}
        onItemClick={handleItemClick}
        onViewDetails={handleViewDetails}
        highlightItemId={highlightItemId}
      >
        {expandedState.atoms.has(atom.id) && renderParticles(atom)}
      </TreeItem>
    ));
  };

  const renderMolecules = (matter: Matter) => {
    return matter.children.map((molecule, _index) => (
      <TreeItem
        key={molecule.id}
        id={molecule.id}
        name={molecule.name}
        layer={molecule.layer}
        isExpanded={expandedState.molecules.has(molecule.id)}
        hasChildren={molecule.children.length > 0}
        level={1}
        onToggle={() => toggleMolecule(molecule.id)}
        onItemClick={handleItemClick}
        onViewDetails={handleViewDetails}
        highlightItemId={highlightItemId}
      >
        {expandedState.molecules.has(molecule.id) && renderAtoms(molecule)}
      </TreeItem>
    ));
  };

  const renderMatters = (subject: Subject) => {
    return subject.children.map((matter, _index) => {
      const isExpanded = expandedState.matters.has(matter.id);
      return (
        <TreeItem
          key={matter.id}
          id={matter.id}
          name={matter.name}
          layer={matter.layer}
          isExpanded={isExpanded}
          hasChildren={matter.children.length > 0}
          level={0}
          onToggle={() => toggleMatter(matter.id)}
          onItemClick={handleItemClick}
          onViewDetails={handleViewDetails}
          highlightItemId={highlightItemId}
        >
          {isExpanded && renderMolecules(matter)}
        </TreeItem>
      );
    });
  };

  if (loading) {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          <div className="flex items-center justify-center py-12">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              <AlertTriangle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Error Loading Knowledge Graph
            </h3>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header Section */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 hover:bg-white/15 transition-all duration-500">
          <div ref={headerRef}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">Knowledge Graph</h3>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search knowledge graph nodes and connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((item) => {
                    const hasChildren = allSearchableItems.some((i) =>
                      i.parentIds.includes(item.id)
                    );
                    return (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-all duration-150 group"
                        onClick={() => handleSearchItemClick(item)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`
                            text-xs px-2 py-1 rounded-full font-medium transition-colors duration-150
                            ${
                              item.layer === "Matter"
                                ? "bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30"
                                : ""
                            }
                            ${
                              item.layer === "Molecule"
                                ? "bg-green-500/20 text-green-300 group-hover:bg-green-500/30"
                                : ""
                            }
                            ${
                              item.layer === "Atom"
                                ? "bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30"
                                : ""
                            }
                            ${
                              item.layer === "Particle"
                                ? "bg-orange-500/20 text-orange-300 group-hover:bg-orange-500/30"
                                : ""
                            }
                            ${
                              item.layer === "Subject"
                                ? "bg-gray-500/20 text-gray-300 group-hover:bg-gray-500/30"
                                : ""
                            }
                          `}
                          >
                            {item.layer}
                          </span>
                          <span className="font-medium text-white flex-grow group-hover:text-blue-300 transition-colors duration-150">
                            {item.name}
                          </span>
                          {hasChildren && (
                            <span className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors duration-150">
                              📂 expandable
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye
                              className="text-slate-400 group-hover:text-blue-300 transition-colors duration-150"
                              size={12}
                            />
                            <span className="text-xs text-slate-400 group-hover:text-blue-300">
                              Navigate
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-blue-300 transition-colors duration-150">
                          📍 {item.path.join(" → ")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {showSearchResults &&
                searchResults.length === 0 &&
                searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 z-50">
                    <div className="p-4 text-center text-slate-400">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  </div>
                )}

              {isExpanding && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-blue-500/20 backdrop-blur-xl rounded-lg border border-blue-500/30 z-50">
                  <div className="p-4 text-center text-blue-300">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                      <span>Expanding sections and navigating...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subject Info */}
            {syllabusData && (
              <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 mb-6">
                <h4 className="text-lg font-semibold text-white">
                  {syllabusData.hierarchy.name}
                </h4>
                <p className="text-sm text-slate-300 mt-1">
                  {syllabusData.hierarchy.children.length} main knowledge nodes
                  in the graph
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="mb-6">
              <h5 className="text-lg font-semibold text-white mb-4">
                Knowledge Graph Structure
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-400" size={16} />
                  <span className="text-sm text-slate-300">
                    Knowledge Domains
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="text-green-400" size={16} />
                  <span className="text-sm text-slate-300">Topic Clusters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Atom className="text-purple-400" size={16} />
                  <span className="text-sm text-slate-300">Concept Nodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="text-orange-400" size={16} />
                  <span className="text-sm text-slate-300">Learning Units</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="inline" />
                    <span>Start learning (units only)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="inline" />
                    <span>View details (all nodes)</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 p-2 rounded border-l-4 border-blue-400/50">
                  <div className="font-medium text-blue-300 mb-1">
                    🔍 Knowledge Graph Navigation:
                  </div>
                  <ul className="text-blue-200 space-y-1">
                    <li>• Search finds nodes across all graph levels</li>
                    <li>
                      • Click search results to auto-expand and highlight nodes
                    </li>
                    <li>• Pulsing blue highlight shows your selected node</li>
                    <li>• Use Escape key to close search anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Knowledge Graph Visualization */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {syllabusData && (
                <div className="space-y-2">
                  {renderMatters(syllabusData.hierarchy)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Helper */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all duration-500">
          <h4 className="text-lg font-bold text-white mb-4">
            Quick Navigation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/lesson-library")}
              className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
            >
              <Globe className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-medium text-white">Browse Graph</div>
                <div className="text-xs text-slate-300">
                  Explore knowledge nodes
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/learning-resource")}
              className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
            >
              <Play className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-medium text-white">View Resources</div>
                <div className="text-xs text-slate-300">
                  Videos, notes & quizzes
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/content-management")}
              className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
            >
              <Award className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-medium text-white">Manage Content</div>
                <div className="text-xs text-slate-300">Upload & organize</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonLibraryManager;
