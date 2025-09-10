"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  retrieveSyllabuses,
  type SyllabusResponse,
  type Subject,
  type Matter,
  type Molecule,
  type Atom,
} from "@/services/contentService";
import {
  FaChevronDown,
  FaChevronRight,
  FaBook,
  FaAtom,
  FaCogs,
  FaDotCircle,
  FaLayerGroup,
  FaPlay,
  FaGraduationCap,
  FaSearch,
  FaEye,
  FaTimes,
} from "react-icons/fa";
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
        return <FaBook className="text-blue-600" size={18} />;
      case "Molecule":
        return <FaCogs className="text-green-600" size={16} />;
      case "Atom":
        return <FaAtom className="text-purple-600" size={14} />;
      case "Particle":
        return <FaDotCircle className="text-orange-500" size={12} />;
      default:
        return <FaLayerGroup className="text-gray-500" size={16} />;
    }
  };

  const getBackgroundColor = () => {
    switch (layer) {
      case "Matter":
        return isExpanded
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-gray-200";
      case "Molecule":
        return isExpanded
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200";
      case "Atom":
        return isExpanded
          ? "bg-purple-50 border-purple-200"
          : "bg-gray-50 border-gray-200";
      case "Particle":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-white border-gray-200";
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
              ? "ring-4 ring-blue-400 bg-blue-100 shadow-lg scale-105"
              : ""
          }
          cursor-pointer hover:shadow-md transform-gpu
        `}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <FaChevronDown
                className="text-gray-500 transition-transform duration-200"
                size={14}
              />
            ) : (
              <FaChevronRight
                className="text-gray-500 transition-transform duration-200"
                size={14}
              />
            )}
          </div>
        )}

        {!hasChildren && (
          <div className="flex-shrink-0">
            <FaPlay className="text-gray-400" size={12} />
          </div>
        )}

        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="flex-grow min-w-0">
          <span
            className={`
            font-medium text-sm
            ${layer === "Matter" ? "text-blue-800" : ""}
            ${layer === "Molecule" ? "text-green-800" : ""}
            ${layer === "Atom" ? "text-purple-800" : ""}
            ${layer === "Particle" ? "text-orange-700" : ""}
          `}
          >
            {name}
          </span>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <span
            className={`
            text-xs px-2 py-1 rounded-full
            ${layer === "Matter" ? "bg-blue-100 text-blue-600" : ""}
            ${layer === "Molecule" ? "bg-green-100 text-green-600" : ""}
            ${layer === "Atom" ? "bg-purple-100 text-purple-600" : ""}
            ${layer === "Particle" ? "bg-orange-100 text-orange-600" : ""}
          `}
          >
            {layer}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(id);
            }}
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="View Details"
          >
            <FaEye size={12} />
          </button>

          {!hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onItemClick(id);
              }}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Start Learning"
            >
              <FaGraduationCap size={14} />
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

export default function LessonLibrary() {
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
      node: Subject | Matter | Molecule | Atom,
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
    router.push(`/concept-page?conceptId=${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/concept-page?conceptId=${id}`);
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

  const renderParticles = (atom: Atom) => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Content
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white p-4">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div ref={headerRef}>
              <h1 className="text-3xl font-bold mb-2">Lesson Library</h1>
              <p className="text-purple-100 mb-4">
                Explore and learn from our comprehensive curriculum
              </p>

              {/* Search Bar */}
              <div className="relative mb-4">
                <div className="relative">
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search topics, concepts, or lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes size={16} />
                    </button>
                  )}
                </div>

                {/* Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((item) => {
                      const hasChildren = allSearchableItems.some((i) =>
                        i.parentIds.includes(item.id)
                      );
                      return (
                        <div
                          key={item.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-150 group"
                          onClick={() => handleSearchItemClick(item)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`
                              text-xs px-2 py-1 rounded-full font-medium transition-colors duration-150
                              ${
                                item.layer === "Matter"
                                  ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                                  : ""
                              }
                              ${
                                item.layer === "Molecule"
                                  ? "bg-green-100 text-green-600 group-hover:bg-green-200"
                                  : ""
                              }
                              ${
                                item.layer === "Atom"
                                  ? "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                                  : ""
                              }
                              ${
                                item.layer === "Particle"
                                  ? "bg-orange-100 text-orange-600 group-hover:bg-orange-200"
                                  : ""
                              }
                              ${
                                item.layer === "Subject"
                                  ? "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                  : ""
                              }
                            `}
                            >
                              {item.layer}
                            </span>
                            <span className="font-medium text-gray-800 flex-grow group-hover:text-blue-700 transition-colors duration-150">
                              {item.name}
                            </span>
                            {hasChildren && (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-150">
                                📂 expandable
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <FaEye
                                className="text-gray-400 group-hover:text-blue-500 transition-colors duration-150"
                                size={12}
                              />
                              <span className="text-xs text-gray-400 group-hover:text-blue-500">
                                Navigate
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-150">
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
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 text-center text-gray-500">
                        No results found for &quot;{searchQuery}&quot;
                      </div>
                    </div>
                  )}

                {isExpanding && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-blue-50 rounded-lg shadow-lg border border-blue-200 z-50">
                    <div className="p-4 text-center text-blue-600">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Expanding sections and navigating...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {syllabusData && (
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <h2 className="text-xl font-semibold">
                    {syllabusData.hierarchy.name}
                  </h2>
                  <p className="text-sm text-purple-100 mt-1">
                    {syllabusData.hierarchy.children.length} main topics
                    available for learning
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Learning Hierarchy
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FaBook className="text-blue-600" size={16} />
                <span className="text-sm text-gray-700">Topics (Matter)</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCogs className="text-green-600" size={16} />
                <span className="text-sm text-gray-700">
                  Subtopics (Molecule)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaAtom className="text-purple-600" size={16} />
                <span className="text-sm text-gray-700">Concepts (Atom)</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDotCircle className="text-orange-500" size={16} />
                <span className="text-sm text-gray-700">
                  Lessons (Particle)
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FaGraduationCap className="inline" />
                  <span>Start learning (lessons only)</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye className="inline" />
                  <span>View details (all levels)</span>
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-300">
                <div className="font-medium text-blue-800 mb-1">
                  🔍 Smart Search Features:
                </div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Search finds content across all hierarchy levels</li>
                  <li>
                    • Click search results to auto-expand and highlight items
                  </li>
                  <li>• Pulsing blue highlight shows your selected concept</li>
                  <li>• Use Escape key to close search anytime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Content Tree */}
          <div className="p-8">
            {syllabusData && (
              <div className="space-y-2">
                {renderMatters(syllabusData.hierarchy)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
