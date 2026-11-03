/**
 * Skill Graph
 *
 * Derives a graph from the existing data files: skill nodes link to the
 * evidence (projects, 3D works, art and commercial groups) that lists them in
 * its technologies/tools. Add a tool to any data file and the link appears.
 */

import { artworks } from "./artworks";
import { commercialWorks } from "./commercial";
import { projects } from "./projects";
import { getAllSkills, type SkillCategory } from "./skills";
import { threeDWorks } from "./threeD";

export type EvidenceKind = "project" | "3d" | "art" | "commercial";

export interface SkillNode {
  type: "skill";
  id: string;
  label: string;
  category: SkillCategory;
}

export interface EvidenceNode {
  type: "evidence";
  id: string;
  label: string;
  kind: EvidenceKind;
  /** Section id to scroll to */
  sectionId: string;
  /** Number of works represented (groups only) */
  count?: number;
}

export type GraphNode = SkillNode | EvidenceNode;

export interface GraphLink {
  source: string;
  target: string;
}

export interface SkillGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const normalize = (value: string): string => value.trim().toLowerCase();

interface RawEvidence {
  id: string;
  label: string;
  kind: EvidenceKind;
  sectionId: string;
  tags: string[];
  count?: number;
}

const groupByMedium = (
  items: { medium: string; tools: string[] }[],
  kind: EvidenceKind,
  sectionId: string,
  prefix: string,
): RawEvidence[] => {
  const groups = new Map<string, { tags: Set<string>; count: number }>();
  for (const item of items) {
    const group = groups.get(item.medium) ?? { tags: new Set(), count: 0 };
    for (const tool of item.tools) group.tags.add(tool);
    group.count += 1;
    groups.set(item.medium, group);
  }
  return [...groups.entries()].map(([medium, group]) => ({
    id: `${kind}:${medium}`,
    label: `${prefix}: ${medium}`,
    kind,
    sectionId,
    tags: [...group.tags],
    count: group.count,
  }));
};

export const buildSkillGraph = (): SkillGraphData => {
  const skills = getAllSkills();

  const skillByTag = new Map<string, string>();
  for (const skill of skills) {
    skillByTag.set(normalize(skill.name), skill.name);
    for (const alias of skill.aliases ?? []) {
      skillByTag.set(normalize(alias), skill.name);
    }
  }

  const evidence: RawEvidence[] = [
    ...projects.map((project) => ({
      id: `project:${project.id}`,
      label: project.title,
      kind: "project" as const,
      sectionId: "projects",
      tags: project.technologies,
    })),
    ...threeDWorks.map((work) => ({
      id: `3d:${work.id}`,
      label: work.title,
      kind: "3d" as const,
      sectionId: "three-d",
      tags: work.tools ?? [],
    })),
    ...groupByMedium(artworks, "art", "art-gallery", "Art"),
    ...groupByMedium(commercialWorks, "commercial", "commercial", "Commercial"),
  ];

  const links: GraphLink[] = [];
  const evidenceNodes: EvidenceNode[] = [];
  const linkedSkills = new Set<string>();

  for (const item of evidence) {
    const matched = new Set<string>();
    for (const tag of item.tags) {
      const skillName = skillByTag.get(normalize(tag));
      if (skillName) matched.add(skillName);
    }
    if (matched.size === 0) continue;
    evidenceNodes.push({
      type: "evidence",
      id: item.id,
      label: item.label,
      kind: item.kind,
      sectionId: item.sectionId,
      count: item.count,
    });
    for (const skillName of matched) {
      links.push({ source: `skill:${skillName}`, target: item.id });
      linkedSkills.add(skillName);
    }
  }

  const skillNodes: SkillNode[] = skills.map((skill) => ({
    type: "skill",
    id: `skill:${skill.name}`,
    label: skill.name,
    category: skill.category,
  }));

  return { nodes: [...skillNodes, ...evidenceNodes], links };
};

/** Ids directly connected to `id` (excluding itself). */
export const getNeighbors = (links: GraphLink[], id: string): Set<string> => {
  const result = new Set<string>();
  for (const link of links) {
    if (link.source === id) result.add(link.target);
    else if (link.target === id) result.add(link.source);
  }
  return result;
};

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
}

/**
 * Small deterministic force layout (no dependency). Skills settle toward the
 * middle, evidence toward the edge, linked nodes attract, all nodes repel.
 */
export const layoutGraph = (
  data: SkillGraphData,
  width: number,
  height: number,
  iterations = 300,
): Map<string, PositionedNode> => {
  const cx = width / 2;
  const cy = height / 2;
  const count = data.nodes.length;

  const pos = data.nodes.map((node, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius =
      (node.type === "skill" ? 0.25 : 0.42) * Math.min(width, height);
    return {
      id: node.id,
      isSkill: node.type === "skill",
      x: cx + Math.cos(angle) * radius * 1.4,
      y: cy + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    };
  });
  const index = new Map(pos.map((p, i) => [p.id, i]));

  for (let step = 0; step < iterations; step++) {
    const alpha = 1 - step / iterations;

    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i];
        const b = pos[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const dist2 = Math.max(dx * dx + dy * dy, 25);
        const dist = Math.sqrt(dist2);
        const force = (4200 / dist2) * alpha;
        dx /= dist;
        dy /= dist;
        a.vx += dx * force;
        a.vy += dy * force;
        b.vx -= dx * force;
        b.vy -= dy * force;
      }
    }

    for (const link of data.links) {
      const a = pos[index.get(link.source) ?? 0];
      const b = pos[index.get(link.target) ?? 0];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const force = (dist - 110) * 0.02 * alpha;
      a.vx += (dx / dist) * force;
      a.vy += (dy / dist) * force;
      b.vx -= (dx / dist) * force;
      b.vy -= (dy / dist) * force;
    }

    for (const p of pos) {
      // Elliptical pull toward the centre, stronger for skills
      p.vx += (cx - p.x) * (p.isSkill ? 0.012 : 0.005) * alpha;
      p.vy += (cy - p.y) * (p.isSkill ? 0.016 : 0.007) * alpha;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.6;
      p.vy *= 0.6;
      p.x = Math.min(width - 70, Math.max(70, p.x));
      p.y = Math.min(height - 30, Math.max(30, p.y));
    }
  }

  return new Map(pos.map((p) => [p.id, { id: p.id, x: p.x, y: p.y }]));
};
