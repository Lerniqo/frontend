"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  retrieveSyllabuses,
  SyllabusResponse,
  Subject,
  Matter,
  Molecule,
  Atom,
  Particle,
} from "../../../services/contentService";

interface GraphNode {
  id: string;
  name: string;
  layer: string;
  x: number;
  y: number;
  level: number;
  radius: number;
  color: string;
  animationDelay: number;
}

interface Connection {
  from: string;
  to: string;
  id: string;
}

const SyllabusGraph = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [syllabusData, setSyllabusData] = useState<SyllabusResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Color scheme for different layers - Blue Green White Mix (moved outside to prevent re-creation)
  const layerColors = React.useMemo(
    () => ({
      Subject: "#F0F9FF", // Very light blue (almost white)
      Matter: "#0EA5E9", // Sky blue
      Molecule: "#06B6D4", // Cyan
      Atom: "#059669", // Emerald green
      Particle: "#064E3B", // Dark green
    }),
    []
  );

  // Fetch syllabus data on component mount
  useEffect(() => {
    const fetchSyllabusData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await retrieveSyllabuses();
        setSyllabusData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load syllabus data"
        );
        console.error("Error fetching syllabus data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabusData();
  }, []);

  // Calculate positions for nodes using a radial layout
  const calculateLayout = useCallback(
    (
      data: Subject,
      centerX = 400,
      centerY = 300,
      radius = 180,
      startAngle = 0,
      angleSpan = Math.PI * 2
    ): GraphNode[] => {
      const layout: GraphNode[] = [];

      const processNode = (
        node: Subject | Matter | Molecule | Atom,
        x: number,
        y: number,
        level: number,
        angle: number,
        span: number,
        index = 0
      ) => {
        const nodeData: GraphNode = {
          ...node,
          x,
          y,
          level,
          radius: Math.max(25 - level * 4, 6),
          color:
            layerColors[node.layer as keyof typeof layerColors] ||
            layerColors["Particle"],
          animationDelay: index * 100 + level * 200,
        };
        layout.push(nodeData);

        let childIndex = 0;
        if ("children" in node && node.children && node.children.length > 0) {
          const childAngleSpan = span / Math.max(node.children.length, 1);
          node.children.forEach((child, i) => {
            const childAngle = angle - span / 2 + childAngleSpan * (i + 0.5);
            const childRadius = radius * (0.6 + level * 0.15);
            const childX = x + Math.cos(childAngle) * childRadius;
            const childY = y + Math.sin(childAngle) * childRadius;
            processNode(
              child,
              childX,
              childY,
              level + 1,
              childAngle,
              childAngleSpan,
              childIndex++
            );
          });
        }

        if (
          "particles" in node &&
          node.particles &&
          node.particles.length > 0
        ) {
          const particleAngleSpan = span / Math.max(node.particles.length, 1);
          node.particles.forEach((particle, i) => {
            const particleAngle =
              angle - span / 2 + particleAngleSpan * (i + 0.5);
            const particleRadius = radius * 0.35;
            const particleX = x + Math.cos(particleAngle) * particleRadius;
            const particleY = y + Math.sin(particleAngle) * particleRadius;
            const particleData: GraphNode = {
              ...particle,
              x: particleX,
              y: particleY,
              level: level + 1,
              radius: 5,
              layer: "Particle",
              color: layerColors["Particle"],
              animationDelay: childIndex * 100 + (level + 1) * 200,
            };
            layout.push(particleData);
            childIndex++;
          });
        }
      };

      processNode(data, centerX, centerY, 0, startAngle, angleSpan);
      return layout;
    },
    [layerColors]
  );

  // Process syllabus data when it's loaded
  useEffect(() => {
    if (!syllabusData?.hierarchy) return;

    const layout = calculateLayout(syllabusData.hierarchy);
    setNodes(layout);

    // Generate connections
    const conns: Connection[] = [];
    const processConnections = (
      node: Subject | Matter | Molecule | Atom | Particle,
      parentId: string | null = null
    ) => {
      if (parentId) {
        conns.push({
          from: parentId,
          to: node.id,
          id: `${parentId}-${node.id}`,
        });
      }

      if ("children" in node && node.children) {
        node.children.forEach((child) => processConnections(child, node.id));
      }
      if ("particles" in node && node.particles) {
        node.particles.forEach((particle) =>
          processConnections(particle, node.id)
        );
      }
    };
    processConnections(syllabusData.hierarchy);
    setConnections(conns);
  }, [syllabusData?.hierarchy, calculateLayout]);

  // Animation trigger
  useEffect(() => {
    if (nodes.length === 0) return;

    // Start animation phases immediately
    setAnimationPhase(2); // Show connections immediately
  }, [nodes]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const handleNodeHover = (node: GraphNode, isHovering: boolean) => {
    setHoveredNode(isHovering ? node : null);
  };

  const getNodeScale = (node: GraphNode) => {
    if (selectedNode?.id === node.id) return 1.4;
    if (hoveredNode?.id === node.id) return 1.2;
    return 1;
  };

  const getNodeOpacity = (node: GraphNode) => {
    if (selectedNode && selectedNode.id !== node.id) return 0.6;
    return 1;
  };

  const getParticleCount = (node: GraphNode): number => {
    // Find the original node data to get particle count
    if (!syllabusData?.hierarchy) return 0;

    const findOriginalNode = (
      searchNode: Subject | Matter | Molecule | Atom,
      targetId: string
    ): Atom | null => {
      if (searchNode.id === targetId && "particles" in searchNode) {
        return searchNode as Atom;
      }

      if ("children" in searchNode && searchNode.children) {
        for (const child of searchNode.children) {
          const found = findOriginalNode(child, targetId);
          if (found) return found;
        }
      }

      return null;
    };

    const originalNode = findOriginalNode(syllabusData.hierarchy, node.id);
    return originalNode?.particles?.length || 0;
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Syllabus Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-black/30 backdrop-blur-md rounded-lg p-8 border border-red-500/30">
          <p className="text-red-300 text-xl mb-4">Error Loading Syllabus</p>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">
          {syllabusData?.hierarchy.name || "Syllabus"} Graph
        </h1>
        <div className="flex flex-wrap gap-2">
          {Object.entries(layerColors).map(([layer, color]) => (
            <div key={layer} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-white text-sm">{layer}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Node Info Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md rounded-lg p-4 max-w-sm border border-white/10 animate-in slide-in-from-right duration-300">
          <h3 className="text-xl font-bold text-white mb-2">
            {selectedNode.name}
          </h3>
          <div className="space-y-2">
            <p className="text-cyan-200">
              <span className="font-semibold">Layer:</span> {selectedNode.layer}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">ID:</span> {selectedNode.id}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Level:</span> {selectedNode.level}
            </p>
            {selectedNode.layer === "Atom" && (
              <p className="text-gray-300 text-sm">
                <span className="font-semibold">Particles:</span>{" "}
                {getParticleCount(selectedNode)}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      )}

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        style={{ background: "transparent" }}
      >
        {/* Definitions for gradients and effects */}
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        <g className="connections">
          {connections.map((conn, index) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);

            if (!fromNode || !toNode) return null;

            const opacity = animationPhase >= 2 ? 0.6 : 0.3;

            return (
              <line
                key={conn.id}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                opacity={opacity}
                style={{
                  transition: `all 1s ease ${index * 20}ms`,
                }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node, index) => {
            const scale = getNodeScale(node);
            const opacity = getNodeOpacity(node);

            return (
              <g key={node.id}>
                {/* Glow effect */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={(node.radius + 8) * scale}
                  fill="url(#nodeGlow)"
                  style={{
                    color: node.color,
                    opacity: opacity * 0.3,
                  }}
                  className="node-glow"
                />

                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius * scale}
                  fill={node.color}
                  className="cursor-pointer transition-all duration-300 ease-out"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => handleNodeHover(node, true)}
                  onMouseLeave={() => handleNodeHover(node, false)}
                  filter="url(#glow)"
                  style={{
                    opacity: opacity,
                  }}
                />

                {/* Node label for larger nodes */}
                {node.radius > 8 && (
                  <text
                    x={node.x}
                    y={node.y + node.radius * scale + 15}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none select-none"
                    style={{
                      fontFamily: "system-ui",
                      opacity: opacity * 0.9,
                    }}
                  >
                    {node.name.length > 15
                      ? node.name.substring(0, 12) + "..."
                      : node.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <p className="text-white text-sm mb-2 font-semibold">
          Interactive Controls:
        </p>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>• Click nodes to select and view details</li>
          <li>• Hover to highlight and scale</li>
          <li>• Colors represent hierarchy layers</li>
          <li>• Animations show structure emergence</li>
        </ul>
      </div>

      {/* Stats Panel */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <p className="text-white text-sm font-semibold mb-2">Statistics:</p>
        <div className="text-gray-300 text-xs space-y-1">
          <p>Total Nodes: {nodes.length}</p>
          <p>Connections: {connections.length}</p>
          <p>Max Depth: {Math.max(...nodes.map((n) => n.level), 0)}</p>
          <p>Subject: {syllabusData?.hierarchy.name}</p>
        </div>
      </div>
    </div>
  );
};

export default SyllabusGraph;
