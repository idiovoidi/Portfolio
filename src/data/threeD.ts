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
    modelPath: "/3D/AnyConv.com__Barrel_FBX.glb",
    category: "Model",
    tools: ["Maya", "Substance Painter"],
  },
  {
    id: "corrupted-healthpack",
    title: "Corrupted Healthpack",
    description: "Corrupted health restoration item with PBR textures",
    // Use base mesh + external maps (embedded bake hits blob Image() issues in some browsers)
    modelPath: "/3D/corrupted-healthpack.glb",
    category: "Model",
    tools: ["Maya", "Substance Painter"],
    textures: {
      albedo: "/3D/Corrupted_Healthpack/openPBR_shader1_AlbedoTransparency.png",
      normal: "/3D/Corrupted_Healthpack/openPBR_shader1_Normal.png",
      emission: "/3D/Corrupted_Healthpack/openPBR_shader1_Emission.png",
      metallicSmoothness:
        "/3D/Corrupted_Healthpack/openPBR_shader1_MetallicSmoothness.png",
    },
  },
  {
    id: "enemy",
    title: "Enemy Character",
    description: "3D enemy character model",
    modelPath: "/3D/enemy.glb",
    category: "Character",
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
