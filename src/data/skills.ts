/**
 * Skills Data
 *
 * This file contains your technical skills organized by category.
 *
 * HOW TO ADD NEW SKILLS:
 * 1. Find the appropriate category in the skillsData array below
 * 2. Add a new skill object to the skills array:
 *    {
 *      name: 'Skill Name',
 *      category: 'frontend',  // Must match the category type
 *      icon: 'SiReact',       // Optional: Icon name from react-icons/si (Simple Icons)
 *      proficiency: 85        // Optional: 1-100 scale
 *    }
 *
 * 3. To add a new category, add a new object to skillsData:
 *    {
 *      name: 'Category Name',
 *      skills: [...]
 *    }
 *
 * ICON REFERENCE:
 * - Use Simple Icons from react-icons: https://react-icons.github.io/react-icons/icons/si/
 * - Format: 'Si' + PascalCaseName (e.g., 'SiJavascript', 'SiReact', 'SiTailwindcss')
 */

export type SkillCategory =
  | "frontend"
  | "backend"
  | "tools"
  | "design"
  | "other";

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string; // Icon name from react-icons (e.g., 'SiReact')
  proficiency?: number; // Optional: 1-100 scale
  /** Other names this skill appears under in project/artwork tool lists */
  aliases?: string[];
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

// Add your skills here, organized by category
export const skillsData: SkillGroup[] = [
  {
    name: "Frontend Development",
    skills: [
      { name: "React", category: "frontend", icon: "SiReact", proficiency: 90 },
      {
        name: "JavaScript / TypeScript",
        category: "frontend",
        icon: "SiJavascript",
        proficiency: 95,
        aliases: ["JavaScript", "TypeScript"],
      },
      {
        name: "HTML5",
        category: "frontend",
        icon: "SiHtml5",
        proficiency: 95,
        aliases: ["HTML5 Canvas"],
      },
      {
        name: "Tailwind CSS",
        category: "frontend",
        icon: "SiTailwindcss",
        proficiency: 85,
      },
      {
        name: "PyQt6",
        category: "frontend",
        icon: "SiQt",
        proficiency: 90,
      },
      { name: "Three.js", category: "frontend", icon: "SiThreedotjs" },
      { name: "Pixi.js", category: "frontend", icon: "SiPixijs" },
      { name: "Babylon.js", category: "frontend" },
    ],
  },
  {
    name: "Backend Development",
    skills: [
      {
        name: "Python",
        category: "backend",
        icon: "SiPython",
        proficiency: 75,
      },
      {
        name: "MongoDB",
        category: "backend",
        icon: "SiMongodb",
        proficiency: 85,
      },
      {
        name: "MariaDB",
        category: "backend",
        icon: "SiMariadb",
        proficiency: 80,
      },
      { name: "SQLite", category: "backend", icon: "SiSqlite" },
    ],
  },
  {
    name: "Design & Creative",
    skills: [
      {
        name: "Blender",
        category: "design",
        icon: "SiBlender",
        proficiency: 75,
      },
      {
        name: "Adobe Photoshop",
        category: "design",
        icon: "SiAdobephotoshop",
        proficiency: 80,
        aliases: ["Photoshop"],
      },
      {
        name: "Adobe Illustrator",
        category: "design",
        icon: "SiAdobeillustrator",
        proficiency: 75,
        aliases: ["Illustrator"],
      },
      {
        name: "Unreal Engine",
        category: "design",
        icon: "SiUnrealengine",
        proficiency: 65,
      },
      {
        name: "Cubase",
        category: "design",
        icon: "SiSteinberg",
        proficiency: 85,
      },
      { name: "Maya", category: "design" },
      { name: "Substance Painter", category: "design" },
      { name: "Lightroom", category: "design", icon: "SiAdobelightroom" },
      { name: "InDesign", category: "design", icon: "SiAdobeindesign" },
      { name: "Figma", category: "design", icon: "SiFigma" },
      {
        name: "Premiere",
        category: "design",
        icon: "SiAdobepremierepro",
        aliases: ["Premiere Pro"],
      },
      { name: "Photography", category: "design", aliases: ["Canon EOS 600D"] },
    ],
  },
];

// Helper function to get all skills flattened
export const getAllSkills = (): Skill[] => {
  return skillsData.flatMap((group) => group.skills);
};

// Helper function to get skills by category
export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return getAllSkills().filter((skill) => skill.category === category);
};

// Helper function to get top skills by proficiency
export const getTopSkills = (limit: number = 10): Skill[] => {
  return getAllSkills()
    .filter((skill) => skill.proficiency !== undefined)
    .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
    .slice(0, limit);
};
