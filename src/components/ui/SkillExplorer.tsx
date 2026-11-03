import type React from "react";
import { useMemo, useState } from "react";
import {
  buildSkillGraph,
  type EvidenceKind,
  type EvidenceNode,
  getNeighbors,
  type SkillNode,
} from "../../data/skillGraph";
import { skillsData } from "../../data/skills";

const KIND_ORDER: { kind: EvidenceKind; title: string }[] = [
  { kind: "project", title: "Projects" },
  { kind: "3d", title: "3D Work" },
  { kind: "art", title: "Art" },
  { kind: "commercial", title: "Commercial" },
];

const scrollToSection = (sectionId: string) => {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const chipStyle = (
  state: "idle" | "selected" | "linked" | "dim",
): React.CSSProperties => ({
  padding: "0.4rem 0.85rem",
  borderRadius: "9999px",
  fontSize: "0.875rem",
  color: "rgba(226, 232, 240, 0.95)",
  background:
    state === "selected"
      ? "rgba(139, 92, 246, 0.55)"
      : state === "linked"
        ? "rgba(139, 92, 246, 0.25)"
        : "rgba(15, 15, 25, 0.8)",
  border: `1px solid ${
    state === "selected" || state === "linked"
      ? "rgba(196, 181, 253, 0.9)"
      : "rgba(139, 92, 246, 0.3)"
  }`,
  opacity: state === "dim" ? 0.3 : 1,
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
});

export const SkillExplorer: React.FC = () => {
  const graph = useMemo(() => buildSkillGraph(), []);
  const [selected, setSelected] = useState<string | null>(null);

  const neighbors = useMemo(
    () => (selected ? getNeighbors(graph.links, selected) : null),
    [graph, selected],
  );

  const stateOf = (id: string) => {
    if (!selected) return "idle";
    if (id === selected) return "selected";
    return neighbors?.has(id) ? "linked" : "dim";
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev === id ? null : id));

  const skillNodes = graph.nodes.filter(
    (n): n is SkillNode => n.type === "skill",
  );
  const evidenceNodes = graph.nodes.filter(
    (n): n is EvidenceNode => n.type === "evidence",
  );
  const selectedNode = graph.nodes.find((n) => n.id === selected);

  const hint = !selectedNode
    ? "Select a skill to see the work behind it, or a piece of work to see its skills."
    : selectedNode.type === "skill"
      ? neighbors?.size
        ? `${selectedNode.label} is used in the highlighted work. Click an item to jump to it.`
        : `${selectedNode.label} has no linked work yet.`
      : `${selectedNode.label} uses the highlighted skills.`;

  return (
    <div>
      <p
        className="text-center text-sm mb-8 min-h-[1.25rem]"
        style={{ color: "rgba(148, 163, 184, 0.95)" }}
        aria-live="polite"
      >
        {hint}
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h3
            className="text-xl font-semibold"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Skills
          </h3>
          {skillsData.map((group) => (
            <div key={group.name}>
              <h4
                className="text-sm uppercase tracking-wide mb-3"
                style={{ color: "rgba(167, 139, 250, 0.9)" }}
              >
                {group.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillNodes
                  .filter((n) =>
                    group.skills.some((s) => `skill:${s.name}` === n.id),
                  )
                  .map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      aria-pressed={selected === node.id}
                      style={chipStyle(stateOf(node.id))}
                      onClick={() => toggle(node.id)}
                    >
                      {node.label}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3
            className="text-xl font-semibold"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Evidence
          </h3>
          {KIND_ORDER.map(({ kind, title }) => {
            const items = evidenceNodes.filter((n) => n.kind === kind);
            if (items.length === 0) return null;
            return (
              <div key={kind}>
                <h4
                  className="text-sm uppercase tracking-wide mb-3"
                  style={{ color: "rgba(167, 139, 250, 0.9)" }}
                >
                  {title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {items.map((node) => {
                    const state = stateOf(node.id);
                    const jump = state === "linked";
                    return (
                      <button
                        key={node.id}
                        type="button"
                        aria-pressed={selected === node.id}
                        style={chipStyle(state)}
                        onClick={() =>
                          jump
                            ? scrollToSection(node.sectionId)
                            : toggle(node.id)
                        }
                      >
                        {node.label}
                        {node.count ? ` (${node.count})` : ""}
                        {jump ? " ↗" : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillExplorer;
