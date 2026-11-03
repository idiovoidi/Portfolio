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

export interface ThreeDWork {
  id: string;
  title: string;
  description?: string;
  modelPath: string;
  thumbnail?: string;
  category?: string;
  textures?: ModelTextures;
}

export const threeDWorks: ThreeDWork[] = [
  {
    id: "barrel",
    title: "Barrel",
    description: "3D barrel model",
    modelPath: "/3D/AnyConv.com__Barrel_FBX.glb",
    category: "Model",
  },
  {
    id: "corrupted-healthpack",
    title: "Corrupted Healthpack",
    description: "Corrupted health restoration item with PBR textures",
    // Use base mesh + external maps (embedded bake hits blob Image() issues in some browsers)
    modelPath: "/3D/corrupted-healthpack.glb",
    category: "Model",
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
];
