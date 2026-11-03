/**
 * Software Experience Data
 *
 * This file contains software tools and technologies organized by category.
 * The data structure is designed to support future filtering of portfolio pieces by software tags.
 *
 * HOW TO ADD NEW SOFTWARE:
 * 1. Add a new SoftwareEntry object to the softwareData array under the appropriate category:
 *    {
 *      id: 'software-name',           // Unique identifier (kebab-case)
 *      name: 'Software Name',         // Display name
 *      category: 'music',             // Category (see SoftwareCategory type)
 *      icon: 'SiSoftwarename',        // Icon name from react-icons/si (Simple Icons)
 *      version: '4.2',                // Optional: version number
 *      tags: ['audio', 'production'], // Optional: for future filtering
 *      portfolioIds: [],              // Optional: for future filtering
 *    }
 *
 * ICON REFERENCE:
 * - Use Simple Icons from react-icons: https://react-icons.github.io/react-icons/icons/si/
 * - Format: 'Si' + PascalCaseName (e.g., 'SiBlender', 'SiReact', 'SiTypescript')
 * - Same icon system as Skills section for consistency
 *
 * FUTURE TAG ASSOCIATION IMPLEMENTATION:
 *
 * To enable filtering of portfolio pieces by software in the future:
 *
 * 1. ADD PORTFOLIO IDS TO SOFTWARE ENTRIES:
 *    Update the portfolioIds array with IDs of portfolio pieces that use this software:
 *    {
 *      id: 'blender',
 *      portfolioIds: ['3d-character-model', 'environment-scene', 'nft-artwork-1'],
 *    }
 *
 * 2. ADD SOFTWARE IDS TO PORTFOLIO ENTRIES:
 *    In projects.ts, artworks.ts, or nfts.ts, add a softwareUsed field:
 *    {
 *      id: '3d-character-model',
 *      title: '3D Character Model',
 *      softwareUsed: ['blender', 'photoshop'],  // Add this field
 *    }
 *
 * 3. IMPLEMENT FILTERING LOGIC:
 *    In SoftwareCard.tsx, implement the onClick handler:
 *    const handleSoftwareClick = (softwareId: string) => {
 *      const portfolioIds = getPortfolioBySoftwareId(softwareId);
 *      // Filter portfolio pieces by IDs
 *      // Option A: Navigate to filtered portfolio view
 *      // Option B: Highlight matching items in existing sections
 *      // Option C: Show modal with filtered results
 *    };
 *
 * 4. UPDATE HELPER FUNCTION:
 *    The getPortfolioBySoftwareId function below is ready to use once portfolioIds are populated.
 *    You may also want to create a reverse lookup function in portfolio data files.
 */

export type SoftwareCategory =
  | "music"
  | "digital-media"
  | "3d-game"
  | "coding-languages"
  | "databases"
  | "other";

export interface SoftwareEntry {
  id: string; // Unique identifier (kebab-case)
  name: string; // Display name
  category: SoftwareCategory; // Category (music, digital-media, 3d-game, etc.)
  icon: string; // Icon name from react-icons/si (e.g., 'SiBlender', 'SiReact')
  version?: string; // Optional: version number (e.g., "4.2")
  language?: string; // Optional: parent language for libraries (e.g., 'Python', 'JavaScript/TypeScript')
  tags?: string[]; // Optional: tags for filtering (e.g., ['3d', 'modeling'])
  portfolioIds?: string[]; // Optional: IDs of portfolio pieces using this software
}

// Category display configuration
export const categoryConfig: Record<
  SoftwareCategory,
  { title: string; order: number }
> = {
  music: { title: "Music", order: 1 },
  "digital-media": { title: "Digital Media", order: 2 },
  "3d-game": { title: "3D + Game", order: 3 },
  "coding-languages": { title: "Coding Languages & Libraries", order: 4 },
  databases: { title: "Databases", order: 5 },
  other: { title: "Other", order: 6 },
};

// Software entries organized by category
export const softwareData: SoftwareEntry[] = [
  // Music
  {
    id: "cubase",
    name: "Cubase",
    category: "music",
    icon: "SiSteinberg",
    tags: ["audio", "production", "daw"],
    portfolioIds: [],
  },
  {
    id: "ableton",
    name: "Ableton Live",
    category: "music",
    icon: "SiAbleton",
    tags: ["audio", "production", "daw"],
    portfolioIds: [],
  },

  // Digital Media
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    category: "digital-media",
    icon: "SiAdobephotoshop",
    tags: ["design", "image-editing", "digital-art"],
    portfolioIds: [],
  },
  {
    id: "davinci-resolve",
    name: "DaVinci Resolve",
    category: "digital-media",
    icon: "SiDavinciresolve",
    tags: ["video", "editing", "color-grading"],
    portfolioIds: [],
  },
  {
    id: "lightroom",
    name: "Adobe Lightroom",
    category: "digital-media",
    icon: "SiAdobelightroom",
    tags: ["photography", "editing"],
    portfolioIds: [],
  },
  {
    id: "canva",
    name: "Canva",
    category: "digital-media",
    icon: "SiCanva",
    tags: ["design", "graphics"],
    portfolioIds: [],
  },

  // 3D + Game
  {
    id: "maya",
    name: "Autodesk Maya",
    category: "3d-game",
    icon: "SiAutodesk",
    tags: ["3d", "modeling", "animation"],
    portfolioIds: [],
  },
  {
    id: "substance-painter",
    name: "Substance Painter",
    category: "3d-game",
    icon: "SiAdobe",
    tags: ["3d", "texturing", "materials"],
    portfolioIds: [],
  },
  {
    id: "unity",
    name: "Unity",
    category: "3d-game",
    icon: "SiUnity",
    version: "5.0",
    tags: ["game-dev", "3d", "c-sharp"],
    portfolioIds: [],
  },
  {
    id: "unreal-engine",
    name: "Unreal Engine",
    category: "3d-game",
    icon: "SiUnrealengine",
    version: "5.7",
    tags: ["game-dev", "3d", "rendering"],
    portfolioIds: [],
  },

  // Coding Languages & Libraries
  {
    id: "javascript",
    name: "JavaScript",
    category: "coding-languages",
    icon: "SiJavascript",
    tags: ["frontend", "backend", "web-development"],
    portfolioIds: [],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "coding-languages",
    icon: "SiTypescript",
    tags: ["frontend", "backend", "web-development"],
    portfolioIds: [],
  },
  {
    id: "babylonjs",
    name: "Babylon.js",
    category: "coding-languages",
    language: "JavaScript/TypeScript",
    icon: "SiBabylondotjs",
    tags: ["3d", "webgl", "rendering"],
    portfolioIds: [],
  },
  {
    id: "pixijs",
    name: "Pixi.js",
    category: "coding-languages",
    language: "JavaScript/TypeScript",
    icon: "SiPixi",
    tags: ["2d", "webgl", "rendering"],
    portfolioIds: [],
  },
  {
    id: "matterjs",
    name: "Matter.js",
    category: "coding-languages",
    language: "JavaScript/TypeScript",
    icon: "SiJavascript",
    tags: ["physics", "2d", "game-dev"],
    portfolioIds: [],
  },
  {
    id: "react",
    name: "React",
    category: "coding-languages",
    language: "JavaScript/TypeScript",
    icon: "SiReact",
    tags: ["frontend", "web-development", "ui"],
    portfolioIds: [],
  },
  {
    id: "python",
    name: "Python",
    category: "coding-languages",
    icon: "SiPython",
    tags: ["backend", "scripting", "data"],
    portfolioIds: [],
  },
  {
    id: "pyqt6",
    name: "PyQt6",
    category: "coding-languages",
    language: "Python",
    icon: "SiQt",
    tags: ["python", "gui", "desktop"],
    portfolioIds: [],
  },
  {
    id: "cpp",
    name: "C++",
    category: "coding-languages",
    icon: "SiCplusplus",
    tags: ["systems", "game-dev", "fundamentals"],
    portfolioIds: [],
  },
  {
    id: "csharp",
    name: "C#",
    category: "coding-languages",
    icon: "SiCsharp",
    tags: ["unity", "game-dev", "backend"],
    portfolioIds: [],
  },
  {
    id: "git",
    name: "Git",
    category: "coding-languages",
    icon: "SiGit",
    tags: ["version-control", "collaboration"],
    portfolioIds: [],
  },

  // Databases
  {
    id: "sql",
    name: "SQL",
    category: "databases",
    icon: "SiMysql",
    tags: ["database", "query"],
    portfolioIds: [],
  },
  {
    id: "sqlite",
    name: "SQLite",
    category: "databases",
    icon: "SiSqlite",
    tags: ["database", "embedded"],
    portfolioIds: [],
  },
  {
    id: "mariadb",
    name: "MariaDB",
    category: "databases",
    icon: "SiMariadb",
    tags: ["database", "sql"],
    portfolioIds: [],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "databases",
    icon: "SiMongodb",
    tags: ["database", "nosql"],
    portfolioIds: [],
  },

  // Other
  {
    id: "obsidian",
    name: "Obsidian",
    category: "other",
    icon: "SiObsidian",
    tags: ["notes", "knowledge-management"],
    portfolioIds: [],
  },
];

/**
 * Get software entries by category
 * @param category - Category to filter by (e.g., 'music', 'digital-media', '3d-game')
 * @returns Array of software entries in the specified category
 */
export const getSoftwareByCategory = (
  category: SoftwareCategory,
): SoftwareEntry[] => {
  return softwareData.filter((software) => software.category === category);
};

/**
 * Get software entries grouped by language within a category
 * Used for displaying libraries under their parent languages
 * @param category - Category to filter by
 * @returns Object with language groups and standalone entries
 */
export const getSoftwareGroupedByLanguage = (
  category: SoftwareCategory,
): {
  standalone: SoftwareEntry[];
  grouped: Record<string, SoftwareEntry[]>;
} => {
  const software = getSoftwareByCategory(category);
  const standalone: SoftwareEntry[] = [];
  const grouped: Record<string, SoftwareEntry[]> = {};

  software.forEach((entry) => {
    if (entry.language) {
      // This is a library/framework - group it under its language
      if (!grouped[entry.language]) {
        grouped[entry.language] = [];
      }
      grouped[entry.language].push(entry);
    } else {
      // This is a standalone language/tool
      standalone.push(entry);
    }
  });

  return { standalone, grouped };
};

/**
 * Get all categories that have software entries, sorted by display order
 * @returns Array of categories with their display configuration
 */
export const getActiveCategories = (): Array<{
  category: SoftwareCategory;
  title: string;
  order: number;
}> => {
  const activeCategories = new Set(softwareData.map((s) => s.category));
  return Object.entries(categoryConfig)
    .filter(([category]) => activeCategories.has(category as SoftwareCategory))
    .map(([category, config]) => ({
      category: category as SoftwareCategory,
      ...config,
    }))
    .sort((a, b) => a.order - b.order);
};

/**
 * Get a specific software entry by ID
 * @param id - Unique software identifier (kebab-case)
 * @returns Software entry or undefined if not found
 */
export const getSoftwareById = (id: string): SoftwareEntry | undefined => {
  return softwareData.find((software) => software.id === id);
};

/**
 * Get portfolio piece IDs associated with a software entry
 * This function is ready for future filtering implementation.
 *
 * @param softwareId - Unique software identifier
 * @returns Array of portfolio piece IDs, or empty array if none found
 *
 * @example
 * // Once portfolioIds are populated:
 * const blenderProjects = getPortfolioBySoftwareId('blender');
 * // Returns: ['3d-character-model', 'environment-scene', 'nft-artwork-1']
 */
export const getPortfolioBySoftwareId = (softwareId: string): string[] => {
  const software = getSoftwareById(softwareId);
  return software?.portfolioIds || [];
};

/**
 * Get all software entries (both main and past)
 * @returns Array of all software entries
 */
export const getAllSoftware = (): SoftwareEntry[] => {
  return softwareData;
};

/**
 * Get software entries by tag
 * This function is ready for future tag-based filtering.
 *
 * @param tag - Tag to filter by (e.g., '3d', 'design', 'web-development')
 * @returns Array of software entries with the specified tag
 *
 * @example
 * const threeDSoftware = getSoftwareByTag('3d');
 * // Returns: [Blender, Unity, Maya]
 */
export const getSoftwareByTag = (tag: string): SoftwareEntry[] => {
  return softwareData.filter((software) => software.tags?.includes(tag));
};
