#!/usr/bin/env node

/**
 * Bake PBR textures into a GLB (embeds images).
 *
 * Usage:
 *   node scripts/apply-textures-to-glb.js <model.glb> <texture-folder> [output.glb]
 *
 * Supports Unity-style MetallicSmoothness maps (R=metalness, A=smoothness).
 */

import { createCanvas, Image, loadImage } from "canvas";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import { JSDOM } from "jsdom";
import { basename, extname, join, resolve } from "path";
import * as THREE from "three";
import { GLTFExporter, GLTFLoader } from "three-stdlib";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
global.self = global;
global.Image = Image;
global.HTMLCanvasElement = createCanvas(1, 1).constructor;
global.HTMLImageElement = Image;

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: node scripts/apply-textures-to-glb.js <model.glb> <texture-folder> [output.glb]",
  );
  process.exit(1);
}

const modelPath = resolve(args[0]);
const textureFolderPath = resolve(args[1]);
const outputPath = args[2]
  ? resolve(args[2])
  : modelPath.replace(/\.glb$/i, "-textured.glb");

if (!existsSync(modelPath)) {
  console.error(`Model not found: ${modelPath}`);
  process.exit(1);
}
if (!existsSync(textureFolderPath)) {
  console.error(`Texture folder not found: ${textureFolderPath}`);
  process.exit(1);
}

const MAX_TEXTURE_SIZE = Number(process.env.MAX_TEXTURE_SIZE || 2048);

console.log("Applying textures to GLB...");
console.log(`  Model:    ${modelPath}`);
console.log(`  Textures: ${textureFolderPath}`);
console.log(`  Output:   ${outputPath}`);
console.log(`  Max tex:  ${MAX_TEXTURE_SIZE}px`);

function categorizeTextures(files) {
  const textures = {
    albedo: null,
    normal: null,
    metallicSmoothness: null,
    metallic: null,
    roughness: null,
    emission: null,
    ao: null,
  };

  for (const file of files) {
    const lower = file.toLowerCase();
    const fullPath = join(textureFolderPath, file);

    if (
      lower.includes("metallicsmoothness") ||
      lower.includes("metallic_smoothness")
    ) {
      textures.metallicSmoothness = fullPath;
    } else if (
      lower.includes("albedo") ||
      lower.includes("diffuse") ||
      lower.includes("basecolor") ||
      lower.includes("base_color")
    ) {
      textures.albedo = fullPath;
    } else if (lower.includes("normal")) {
      textures.normal = fullPath;
    } else if (lower.includes("metallic") || lower.includes("metalness")) {
      textures.metallic = fullPath;
    } else if (lower.includes("roughness")) {
      textures.roughness = fullPath;
    } else if (lower.includes("emission") || lower.includes("emissive")) {
      textures.emission = fullPath;
    } else if (
      lower.includes("ao") ||
      lower.includes("occlusion") ||
      lower.includes("ambient")
    ) {
      textures.ao = fullPath;
    } else if (lower.includes("transparency") && !textures.albedo) {
      // e.g. AlbedoTransparency.png fallback if albedo key missed
      textures.albedo = fullPath;
    }
  }

  return textures;
}

async function imageToTexture(
  imagePath,
  { colorSpace = THREE.NoColorSpace, flipY = false } = {},
) {
  const img = await loadImage(imagePath);
  let width = img.width;
  let height = img.height;

  if (width > MAX_TEXTURE_SIZE || height > MAX_TEXTURE_SIZE) {
    const scale = MAX_TEXTURE_SIZE / Math.max(width, height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = colorSpace;
  texture.flipY = flipY;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return { texture, width, height, canvas, ctx };
}

/** Unity MetallicSmoothness → separate metalness (R) + roughness (1 - A) maps */
async function splitMetallicSmoothness(imagePath) {
  const img = await loadImage(imagePath);
  let width = img.width;
  let height = img.height;

  if (width > MAX_TEXTURE_SIZE || height > MAX_TEXTURE_SIZE) {
    const scale = MAX_TEXTURE_SIZE / Math.max(width, height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  const src = createCanvas(width, height);
  const srcCtx = src.getContext("2d");
  srcCtx.drawImage(img, 0, 0, width, height);
  const { data } = srcCtx.getImageData(0, 0, width, height);

  const metalCanvas = createCanvas(width, height);
  const roughCanvas = createCanvas(width, height);
  const metalCtx = metalCanvas.getContext("2d");
  const roughCtx = roughCanvas.getContext("2d");
  const metalImg = metalCtx.createImageData(width, height);
  const roughImg = roughCtx.createImageData(width, height);

  for (let i = 0; i < data.length; i += 4) {
    const metal = data[i]; // R
    const smooth = data[i + 3]; // A
    const rough = 255 - smooth;

    metalImg.data[i] = metal;
    metalImg.data[i + 1] = metal;
    metalImg.data[i + 2] = metal;
    metalImg.data[i + 3] = 255;

    roughImg.data[i] = rough;
    roughImg.data[i + 1] = rough;
    roughImg.data[i + 2] = rough;
    roughImg.data[i + 3] = 255;
  }

  metalCtx.putImageData(metalImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);

  const metalnessMap = new THREE.CanvasTexture(metalCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  for (const tex of [metalnessMap, roughnessMap]) {
    tex.colorSpace = THREE.NoColorSpace;
    tex.flipY = false;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
  }

  return { metalnessMap, roughnessMap, width, height };
}

function parseGlb(buffer) {
  return new Promise((resolvePromise, reject) => {
    const loader = new GLTFLoader();
    loader.parse(
      buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ),
      "",
      resolvePromise,
      reject,
    );
  });
}

function exportGlb(scene) {
  return new Promise((resolvePromise, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => resolvePromise(Buffer.from(result)),
      reject,
      { binary: true, embedImages: true, maxTextureSize: MAX_TEXTURE_SIZE },
    );
  });
}

async function main() {
  const textureFiles = readdirSync(textureFolderPath).filter((f) =>
    /\.(png|jpg|jpeg)$/i.test(f),
  );
  if (textureFiles.length === 0) {
    throw new Error("No texture files found in folder");
  }

  console.log(`\nFound ${textureFiles.length} texture files:`);
  textureFiles.forEach((f) => console.log(`  - ${f}`));

  const paths = categorizeTextures(textureFiles);
  console.log("\nMapped:");
  for (const [k, v] of Object.entries(paths)) {
    if (v) console.log(`  ${k}: ${basename(v)}`);
  }

  console.log("\nLoading GLB...");
  const glbData = readFileSync(modelPath);
  const gltf = await parseGlb(glbData);
  console.log("GLB loaded");

  console.log("\nLoading / converting textures...");
  const maps = {};

  if (paths.albedo) {
    const { texture, width, height } = await imageToTexture(paths.albedo, {
      colorSpace: THREE.SRGBColorSpace,
    });
    maps.map = texture;
    console.log(`  albedo ${width}x${height}`);
  }
  if (paths.normal) {
    const { texture, width, height } = await imageToTexture(paths.normal);
    maps.normalMap = texture;
    console.log(`  normal ${width}x${height}`);
  }
  if (paths.emission) {
    const { texture, width, height } = await imageToTexture(paths.emission, {
      colorSpace: THREE.SRGBColorSpace,
    });
    maps.emissiveMap = texture;
    console.log(`  emission ${width}x${height}`);
  }
  if (paths.ao) {
    const { texture, width, height } = await imageToTexture(paths.ao);
    maps.aoMap = texture;
    console.log(`  ao ${width}x${height}`);
  }

  if (paths.metallicSmoothness) {
    const { metalnessMap, roughnessMap, width, height } =
      await splitMetallicSmoothness(paths.metallicSmoothness);
    maps.metalnessMap = metalnessMap;
    maps.roughnessMap = roughnessMap;
    console.log(`  metallicSmoothness split ${width}x${height}`);
  } else {
    if (paths.metallic) {
      const { texture, width, height } = await imageToTexture(paths.metallic);
      maps.metalnessMap = texture;
      console.log(`  metallic ${width}x${height}`);
    }
    if (paths.roughness) {
      const { texture, width, height } = await imageToTexture(paths.roughness);
      maps.roughnessMap = texture;
      console.log(`  roughness ${width}x${height}`);
    }
  }

  let materialCount = 0;
  gltf.scene.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    const next = materials.map((mat) => {
      const material =
        mat instanceof THREE.MeshStandardMaterial
          ? mat.clone()
          : new THREE.MeshStandardMaterial({
              color: mat.color?.clone?.() ?? 0xffffff,
              name: mat.name,
            });

      if (maps.map) material.map = maps.map;
      if (maps.normalMap) material.normalMap = maps.normalMap;
      if (maps.metalnessMap) {
        material.metalnessMap = maps.metalnessMap;
        material.metalness = 1;
      }
      if (maps.roughnessMap) {
        material.roughnessMap = maps.roughnessMap;
        material.roughness = 1;
      }
      if (maps.emissiveMap) {
        material.emissiveMap = maps.emissiveMap;
        material.emissive = new THREE.Color(0xffffff);
        material.emissiveIntensity = 1;
      }
      if (maps.aoMap) material.aoMap = maps.aoMap;

      material.needsUpdate = true;
      materialCount += 1;
      return material;
    });

    child.material = next.length === 1 ? next[0] : next;
  });

  console.log(`\nApplied maps to ${materialCount} material(s)`);
  console.log("Exporting GLB...");

  const outBuffer = await exportGlb(gltf.scene);
  writeFileSync(outputPath, outBuffer);

  const mb = (statSync(outputPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\nDone: ${outputPath} (${mb} MB)`);
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});
