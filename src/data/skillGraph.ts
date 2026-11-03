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
