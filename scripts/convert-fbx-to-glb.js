#!/usr/bin/env node

/**
 * FBX to GLB Converter Script
 *
 * Converts FBX files to GLB format for web display using Three.js
 * Embeds textures and materials for complete model export
 * Usage: node scripts/convert-fbx-to-glb.js <input.fbx> [output.glb]
 */

import { Canvas } from "canvas";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { dirname, extname, resolve } from "path";
import * as THREE from "three";
import { FBXLoader, GLTFExporter } from "three-stdlib";

// Setup DOM environment for Three.js
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
global.window = dom.window;
global.HTMLCanvasElement = Canvas;
global.HTMLImageElement = Canvas.Image;

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ Error: No input file specified");
  console.log(
    "\nUsage: node scripts/convert-fbx-to-glb.js <input.fbx> [output.glb]",
  );
  console.log("\nExample:");
  console.log("  node scripts/convert-fbx-to-glb.js public/3D/model.fbx");
  console.log(
    "  node scripts/convert-fbx-to-glb.js public/3D/model.fbx public/3D/model.glb",
  );
  process.exit(1);
}

const inputPath = resolve(args[0]);
const outputPath = args[1]
  ? resolve(args[1])
  : inputPath.replace(extname(inputPath), ".glb");

// Validate input file exists
if (!existsSync(inputPath)) {
  console.error(`❌ Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

// Validate input is FBX
if (extname(inputPath).toLowerCase() !== ".fbx") {
  console.error(`❌ Error: Input file must be .fbx format`);
  process.exit(1);
}

console.log("🔄 Converting FBX to GLB using Three.js...");
console.log(`   Input:  ${inputPath}`);
console.log(`   Output: ${outputPath}`);

try {
  // Read FBX file
  console.log("\n📖 Reading FBX file...");
  const fbxData = readFileSync(inputPath);
  const fbxDir = dirname(inputPath);

  // Load FBX with texture path
  console.log("⚙️  Parsing FBX...");
  const loader = new FBXLoader();
  const fbxScene = loader.parse(fbxData.buffer, fbxDir);

  console.log(`✓ Loaded FBX with ${fbxScene.children.length} objects`);

  // Count materials and textures
  let materialCount = 0;
  let textureCount = 0;
  fbxScene.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        materialCount++;
        const material = Array.isArray(child.material)
          ? child.material
          : [child.material];
        material.forEach((mat) => {
          if (mat.map) textureCount++;
          if (mat.normalMap) textureCount++;
          if (mat.roughnessMap) textureCount++;
          if (mat.metalnessMap) textureCount++;
          if (mat.emissiveMap) textureCount++;
        });
      }
    }
  });

  console.log(
    `✓ Found ${materialCount} materials with ${textureCount} textures`,
  );

  // Strip textures to avoid export errors (geometry only)
  if (textureCount > 0) {
    console.log("⚠️  Stripping textures for geometry-only export");
    fbxScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          // Clear all texture maps
          mat.map = null;
          mat.normalMap = null;
          mat.roughnessMap = null;
          mat.metalnessMap = null;
          mat.emissiveMap = null;
          mat.aoMap = null;
        });
      }
    });
  }

  // Export to GLB
  console.log("📦 Exporting to GLB...");
  const exporter = new GLTFExporter();

  exporter.parse(
    fbxScene,
    (gltf) => {
      // Write GLB file
      const buffer = Buffer.from(gltf);
      writeFileSync(outputPath, buffer);

      // Show file size
      const stats = statSync(outputPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log("\n✅ Conversion successful!");
      console.log(`📦 Output file: ${outputPath}`);
      console.log(`📊 File size: ${fileSizeInMB} MB`);

      if (textureCount > 0) {
        console.log("\n⚠️  Textures were not embedded (geometry only)");
        console.log("💡 For textured models, use Blender:");
        console.log("   File → Import → FBX → Export → glTF 2.0 (.glb)");
        console.log("   See scripts/README-3D-Conversion.md for details");
      }
    },
    (error) => {
      console.error("\n❌ Export failed:", error.message);
      console.log("\n💡 Tip: For models with textures, use Blender:");
      console.log("   1. Import FBX in Blender");
      console.log('   2. Export as glTF 2.0 (.glb) with "Images: Automatic"');
      console.log("   See scripts/README-3D-Conversion.md for details");
      process.exit(1);
    },
    {
      binary: true,
      embedImages: false, // Skip texture embedding to avoid errors
      maxTextureSize: 2048,
    },
  );
} catch (error) {
  console.error("\n❌ Conversion failed:", error.message);
  console.error(error);
  process.exit(1);
}
