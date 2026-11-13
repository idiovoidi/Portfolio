export interface ModelTextures {
  albedo?: string;
  normal?: string;
  emission?: string;
  /** Unity-style packed map: R = metalness, A = smoothness */
  metallicSmoothness?: string;
  metalness?: string;
  roughness?: string;
  ao?: string;
}

export type ThreeDTool = "Maya" | "Substance Painter";

export interface ThreeDWork {
  id: string;
  title: string;
  description?: string;
  /** Omit for image-only works (e.g. ZBrush renders) */
  modelPath?: string;
  /** Image-only works; multiple images share one tile */
  images?: string[];
  /** How multiple images fill the tile: side by side (default) or fading between them */
  imageLayout?: "split" | "cycle";
  thumbnail?: string;
  /** Sketchfab model UID (32-char hex at the end of the model URL); shown as an embed in the modal */
  sketchfabId?: string;
  category?: string;
  /** Software used; rendered as colour-coded tags */
  tools?: ThreeDTool[];
  textures?: ModelTextures;
}

export const threeDWorks: ThreeDWork[] = [
  {
    id: "barrel",
    title: "Barrel",
    description: "3D barrel model",
    sketchfabId: "a566a5cf6074415abff037efbfdfcfb9",
    thumbnail:
      "https://media.sketchfab.com/models/a566a5cf6074415abff037efbfdfcfb9/thumbnails/8227c77daf1d4ad5b4a99b11a1a8993c/5b11b26b6ebc4250b352bfab4b2c04b1.jpeg",
    category: "Model",
    tools: ["Maya", "Substance Painter"],
  },
  {
    id: "corrupted-healthpack",
    title: "Corrupted Healthpack",
    description: "Corrupted health restoration item with PBR textures",
    sketchfabId: "cdaf4afdfea74a93b81820e26a36ba32",
    thumbnail:
      "https://media.sketchfab.com/models/cdaf4afdfea74a93b81820e26a36ba32/thumbnails/6a0ab618d0af4ef98f95322c38986366/01679804c0be481989afd26fbe939258.jpeg",
    category: "Model",
    tools: ["Maya", "Substance Painter"],
  },
  {
    id: "minigun-flamethrower",
    title: "Minigun Flamethrower",
    sketchfabId: "98146df4f3d147d69415a2c061ec8388",
    thumbnail:
      "https://media.sketchfab.com/models/98146df4f3d147d69415a2c061ec8388/thumbnails/1c3ed99552de4513baef14298d3b737f/bcf79f21dc714844b3d54d2af881a188.jpeg",
    category: "Model",
    tools: ["Maya", "Substance Painter"],
  },
  {
    id: "zombie-pope",
    title: "Zombie Pope",
    sketchfabId: "ae329a4ae07c48ad9bc4564a885348d4",
    thumbnail:
      "https://media.sketchfab.com/models/ae329a4ae07c48ad9bc4564a885348d4/thumbnails/74a7e950c2e34e20a99320910de20127/00101ae333ef485798d544adf133721d.jpeg",
    category: "Model",
    tools: ["Maya", "Substance Painter"],
  },
  {
    id: "3d-man-sculpt",
    title: "Male Bust Sculpt",
    images: ["/3D/Zbrush/3D_Man_Sculpt_Zbrush.png"],
    category: "Zbrush",
  },
  {
    id: "chess-pieces",
    title: "Chess Pieces",
    description: "Pawn and queen sculpts",
    images: [
      "/3D/Zbrush/Chess_Pawn_Sculpt.jpg",
      "/3D/Zbrush/Chess_Queen_Sculpt.jpg",
    ],
    category: "Zbrush",
  },
  {
    id: "dolphin",
    title: "Creepy Dolphin",
    description: "He's always watching...",
    images: ["/3D/Zbrush/Dolphin-Angle-1.jpg"],
    category: "Zbrush",
  },
  {
    id: "goat-sculpt",
    title: "Alien Goat Sculpt",
    imageLayout: "cycle",
    images: [
      "/3D/Zbrush/Goat_Sculpt.png",
      "/3D/Zbrush/Goat_Sculpt_Underside.png",
    ],
    category: "Zbrush",
  },
  {
    id: "humanoid-bat-sculpt",
    title: "Humanoid Bat Sculpt",
    imageLayout: "cycle",
    // Side, front and back views cropped from Bat-Render-Strip.jpg into 800px WebPs
    images: [
      "/3D/Zbrush/Bat_Sculpt_1.webp",
      "/3D/Zbrush/Bat_Sculpt_2.webp",
      "/3D/Zbrush/Bat_Sculpt_3.webp",
    ],
    category: "Zbrush",
  },
  {
    id: "kitbash-car",
    title: "Kitbash Car",
    description: "Car sculpt built from kitbashed parts",
    // Downscaled WebP of Zbrush_Kitbash_Car.jpg (3960x5287, 2.9MB -> 1400px, ~95KB)
    images: ["/3D/Zbrush/Zbrush_Kitbash_Car.webp"],
    category: "Zbrush",
  },
];
