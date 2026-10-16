import React, { useState } from 'react';
import { GraphEdge, GraphNode, JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { Network, Info, Eye, Filter } from 'lucide-react';

interface RelationshipGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentLang: JapacLanguage;
  onSelectNode?: (nodeId: string) => void;
}

const KIND_COLORS: Record<GraphNode['kind'], { bg: string; border: string; text: string; label: string }> = {
  owner: { bg: '#1a1a1a', border: '#1a1a1a', text: '#f8f7f4', label: 'Estate Owner' },
  asset: { bg: '#ffffff', border: '#1a1a1a', text: '#1a1a1a', label: 'Asset' },
  institution: { bg: '#f4f3ef', border: '#4a5d4e', text: '#1a1a1a', label: 'Institution' },
  person: { bg: '#fffaf3', border: '#b54708', text: '#b54708', label: 'Nominee / Family' },
  document: { bg: '#f8f7f4', border: '#999999', text: '#1a1a1a', label: 'Evidence Document' },
};

const KIND_COLUMNS: GraphNode['kind'][] = ['person', 'owner', 'asset', 'institution', 'document'];

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  nodes,
  edges,
  currentLang,
  onSelectNode,
}) => {
  const t = translations[currentLang] || translations.en;
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filterKind, setFilterKind] = useState<string>('all');

  const visibleNodes = filterKind === 'all' ? nodes : nodes.filter((n) => n.kind === filterKind);

  const colWidth = 205;
  const rowHeight = 60;
  const colGroups = KIND_COLUMNS.map((k) => visibleNodes.filter((n) => n.kind === k));
  const maxRows = Math.max(...colGroups.map((c) => c.length), 1);
  const totalHeight = Math.max(maxRows * rowHeight + 50, 340);
  const totalWidth = KIND_COLUMNS.length * colWidth + 40;

  const positions: Record<string, { x: number; y: number }> = {};

  colGroups.forEach((group, colIdx) => {
    const colYOffset = (totalHeight - group.length * rowHeight) / 2;
    group.forEach((node, rowIdx) => {
      positions[node.id] = {
        x: 20 + colIdx * colWidth,
        y: colYOffset + rowIdx * rowHeight + rowHeight / 2,
      };
    });
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const relatedEdges = selectedNodeId
    ? edges.filter((e) => e.from === selectedNodeId || e.to === selectedNodeId)
    : [];

  return (
    <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-6 lg:p-8 space-y-4 shadow-xs">
      {/* Header & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1a1a1a]/10 gap-3">
        <div>
          <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 block mb-0.5">
            Knowledge Evidence Graph
          </span>
          <h3 className="font-serif-display text-2xl font-semibold text-[#1a1a1a] tracking-tight">
            {t.workspace.howItConnects}
          </h3>
          <p className="text-xs text-[#1a1a1a]/60 mt-0.5">
            {t.workspace.graphDescription}
          </p>
        </div>

        {/* Kind Filters */}
        <div className="flex items-center gap-1.5 flex-wrap font-mono-meta text-[10px]">
          <button
            onClick={() => setFilterKind('all')}
            className={`px-2.5 py-1 rounded-xs uppercase tracking-wider transition-colors cursor-pointer border ${
              filterKind === 'all'
                ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a] font-semibold'
                : 'bg-[#f8f7f4] border-[#1a1a1a]/15 text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            All ({nodes.length})
          </button>
          {KIND_COLUMNS.map((k) => (
            <button
              key={k}
              onClick={() => setFilterKind(k)}
              className={`px-2 py-1 rounded-xs uppercase tracking-wider transition-colors cursor-pointer border flex items-center gap-1.5 ${
                filterKind === k
                  ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a] font-semibold'
                  : 'bg-white border-[#1a1a1a]/15 text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: KIND_COLORS[k].border }}
              />
              <span>{KIND_COLORS[k].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative overflow-x-auto overflow-y-hidden border border-[#1a1a1a]/15 rounded-xs bg-[#fbfaf8] p-4">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          width={totalWidth}
          height={totalHeight}
          className="select-none"
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#999999" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#1a1a1a" />
            </marker>
          </defs>

          {/* Render Connections */}
          {edges.map((e, idx) => {
            const posA = positions[e.from];
            const posB = positions[e.to];
            if (!posA || !posB) return null;

            const isHighlighted =
              selectedNodeId && (e.from === selectedNodeId || e.to === selectedNodeId);

            const [leftNode, rightNode] = posA.x <= posB.x ? [posA, posB] : [posB, posA];
            const startX = leftNode.x + 175;
            const endX = rightNode.x;
            const midX = (startX + endX) / 2;

            return (
              <g key={`${e.from}-${e.to}-${idx}`}>
                <path
                  d={`M ${startX} ${leftNode.y} C ${midX} ${leftNode.y}, ${midX} ${rightNode.y}, ${endX} ${rightNode.y}`}
                  fill="none"
                  stroke={isHighlighted ? '#1a1a1a' : '#d5d3cb'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={e.kind === 'nominee' ? '3,3' : undefined}
                  markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                  className="transition-all duration-150"
                />
                {isHighlighted && (
                  <text
                    x={midX}
                    y={(leftNode.y + rightNode.y) / 2 - 5}
                    textAnchor="middle"
                    fill="#1a1a1a"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                    className="bg-white px-1"
                  >
                    {e.kind.replace(/_/g, ' ')}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {visibleNodes.map((n) => {
            const p = positions[n.id];
            if (!p) return null;

            const style = KIND_COLORS[n.kind];
            const isSelected = selectedNodeId === n.id;
            const isConnected =
              selectedNodeId &&
              edges.some(
                (e) =>
                  (e.from === selectedNodeId && e.to === n.id) ||
                  (e.to === selectedNodeId && e.from === n.id)
              );

            return (
              <g
                key={n.id}
                transform={`translate(${p.x}, ${p.y - 22})`}
                onClick={() => {
                  setSelectedNodeId(isSelected ? null : n.id);
                  if (onSelectNode) onSelectNode(n.id);
                }}
                className="cursor-pointer group"
              >
                <rect
                  width="175"
                  height="44"
                  rx="2"
                  fill={isSelected ? '#f0eee9' : style.bg}
                  stroke={isSelected ? '#1a1a1a' : isConnected ? '#4a5d4e' : style.border}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-150"
                />

                <text
                  x="10"
                  y="14"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="JetBrains Mono"
                  fill={n.kind === 'owner' ? '#a3a3a3' : '#737373'}
                  letterSpacing="0.08em"
                  className="uppercase"
                >
                  {style.label}
                </text>

                <text
                  x="10"
                  y="28"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter"
                  fill={style.text}
                >
                  {(n.label || '').length > 20
                    ? `${(n.label || '').slice(0, 19)}…`
                    : n.label}
                </text>

                {n.subtitle && (
                  <text
                    x="10"
                    y="38"
                    fontSize="8.5"
                    fontFamily="JetBrains Mono"
                    fill={n.kind === 'owner' ? '#d4d4d4' : '#737373'}
                  >
                    {n.subtitle}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono-meta text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs">
              {selectedNode.kind.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a1a1a] font-serif-display text-base">
                  {selectedNode.label}
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs border border-[#1a1a1a]/20">
                  {selectedNode.kind}
                </span>
              </div>
              <p className="text-[11px] text-[#1a1a1a]/60">
                {selectedNode.subtitle || 'Cryptographically verified relationship node'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#1a1a1a]/60">
              Connections: <strong className="text-[#1a1a1a]">{relatedEdges.length}</strong>
            </span>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-[10px] uppercase underline cursor-pointer text-[#1a1a1a]/70 hover:text-[#1a1a1a]"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
