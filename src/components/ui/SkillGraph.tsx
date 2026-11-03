import type React from "react";
import { useMemo, useState } from "react";
import {
  buildSkillGraph,
  type EvidenceKind,
  getNeighbors,
  layoutGraph,
} from "../../data/skillGraph";
import type { SkillCategory } from "../../data/skills";

const WIDTH = 1000;
const HEIGHT = 640;

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  frontend: "#a78bfa",
  backend: "#60a5fa",
  design: "#f472b6",
  tools: "#34d399",
  other: "#fbbf24",
};

const KIND_LABELS: Record<EvidenceKind, string> = {
  project: "Project",
  "3d": "3D work",
  art: "Artwork",
  commercial: "Commercial",
};

const scrollToSection = (sectionId: string) => {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const SkillGraph: React.FC = () => {
  const graph = useMemo(() => buildSkillGraph(), []);
  const positions = useMemo(() => layoutGraph(graph, WIDTH, HEIGHT), [graph]);
  const nodeById = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph],
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const focus = hovered ?? selected;
  const neighbors = useMemo(
    () => (focus ? getNeighbors(graph.links, focus) : null),
    [graph, focus],
  );

  const isActive = (id: string) =>
    !focus || id === focus || (neighbors?.has(id) ?? false);

  const selectedNode = selected ? nodeById.get(selected) : undefined;
  const connected = selected
    ? [...getNeighbors(graph.links, selected)]
        .map((id) => nodeById.get(id))
        .filter((node) => node !== undefined)
    : [];

  const toggle = (id: string) =>
    setSelected((prev) => (prev === id ? null : id));

  return (
    <div className="skill-graph">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: background click only clears the selection; Escape-free since nodes toggle by keyboard */}
      {/* biome-ignore lint/a11y/useSemanticElements: SVG group */}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="group"
        aria-label="Skills graph. Select a skill to see the projects and artworks that use it."
        onClick={() => setSelected(null)}
      >
        {graph.links.map((link) => {
          const a = positions.get(link.source);
          const b = positions.get(link.target);
          if (!a || !b) return null;
          const active =
            !!focus && (link.source === focus || link.target === focus);
          return (
            <line
              key={`${link.source}-${link.target}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? "#c4b5fd" : "rgba(139, 92, 246, 0.25)"}
              strokeWidth={active ? 2 : 1}
              opacity={!focus || active ? 1 : 0.15}
              style={{ transition: "all 0.25s ease" }}
            />
          );
        })}

        {graph.nodes.map((node) => {
          const p = positions.get(node.id);
          if (!p) return null;
          const active = isActive(node.id);
          const isSkill = node.type === "skill";
          const isSelected = node.id === selected;
          const color = isSkill
            ? CATEGORY_COLORS[node.category]
            : "rgba(226, 232, 240, 0.9)";
          const label = isSkill
            ? node.label
            : node.count
              ? `${node.label} (${node.count})`
              : node.label;

          return (
            // biome-ignore lint/a11y/useSemanticElements: SVG nodes cannot be <button>
            <g
              key={node.id}
              transform={`translate(${p.x} ${p.y})`}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={label}
              opacity={active ? 1 : 0.2}
              style={{
                cursor: "pointer",
                transition: "opacity 0.25s ease",
                outline: "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggle(node.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(node.id);
                }
              }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
            >
              {isSkill ? (
                <circle
                  r={isSelected ? 14 : 11}
                  fill={color}
                  stroke={isSelected ? "#fff" : "none"}
                  strokeWidth={2}
                  style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                />
              ) : (
                <rect
                  x={-6}
                  y={-6}
                  width={12}
                  height={12}
                  rx={2}
                  transform="rotate(45)"
                  fill="rgba(15, 15, 25, 0.9)"
                  stroke={color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
              )}
              <text
                y={isSkill ? 28 : 22}
                textAnchor="middle"
                fontSize={isSkill ? 13 : 11}
                fontWeight={isSkill ? 600 : 400}
                fill={
                  isSkill
                    ? "rgba(226, 232, 240, 0.95)"
                    : "rgba(148, 163, 184, 0.95)"
                }
                style={{ pointerEvents: "none" }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
        style={{ color: "rgba(148, 163, 184, 0.95)" }}
        aria-hidden="true"
      >
        {(Object.keys(CATEGORY_COLORS) as SkillCategory[])
          .filter((category) =>
            graph.nodes.some(
              (n) => n.type === "skill" && n.category === category,
            ),
          )
          .map((category) => (
            <span key={category} className="inline-flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: CATEGORY_COLORS[category] }}
              />
              {category}
            </span>
          ))}
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rotate-45 border"
            style={{ borderColor: "rgba(226, 232, 240, 0.9)" }}
          />
          evidence
        </span>
      </div>

      <div
        className="mt-6 min-h-[5rem] text-center"
        aria-live="polite"
        style={{ color: "rgba(226, 232, 240, 0.95)" }}
      >
        {selectedNode ? (
          <>
            <p className="font-semibold mb-3">
              {selectedNode.label}
              <span className="font-normal opacity-70">
                {" "}
                —{" "}
                {selectedNode.type === "skill"
                  ? connected.length > 0
                    ? `${connected.length} linked ${connected.length === 1 ? "piece" : "pieces"} of work`
                    : "no linked work yet"
                  : `${KIND_LABELS[selectedNode.kind]} using ${connected.length} ${connected.length === 1 ? "skill" : "skills"}`}
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {connected.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    border: "1px solid rgba(139, 92, 246, 0.5)",
                    background: "rgba(15, 15, 25, 0.8)",
                    color: "inherit",
                  }}
                  onClick={() =>
                    node.type === "evidence"
                      ? scrollToSection(node.sectionId)
                      : setSelected(node.id)
                  }
                >
                  {node.type === "evidence"
                    ? `${KIND_LABELS[node.kind]}: ${node.label} ↗`
                    : node.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="opacity-70 text-sm">
            Select a skill to see the work that proves it, or a project to see
            the skills behind it.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillGraph;
