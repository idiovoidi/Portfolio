/**
 * Regenerates optimized WebP thumbnails for commercial assets.
 *
 * Usage: npm run thumbs:commercial
 * Requires ImageMagick (`magick`) on PATH.
 * Optional: ffmpeg on PATH for video poster frames.
 *
 * Output: public/commercial/thumbs/** mirrored from originals
 * Max edge: 900px, quality 78, EXIF stripped, auto-oriented
 */

import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readdir, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../public/commercial");
const THUMBS = path.join(ROOT, "thumbs");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

const SKIP_DIR_NAMES = new Set(["thumbs"]);

async function walk(
  dir: string,
  relative = ""
): Promise<{ images: string[]; videos: string[] }> {
  const entries = await readdir(dir, { withFileTypes: true });
  const images: string[] = [];
  const videos: string[] = [];

  for (const entry of entries) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;

    if (
      relative === "Photography Commercial" &&
      entry.name === "Photography Commercial"
    ) {
      continue;
    }

    const abs = path.join(dir, entry.name);
    const rel = relative ? path.join(relative, entry.name) : entry.name;
    const ext = path.extname(entry.name).toLowerCase();

    if (entry.isDirectory()) {
      const nested = await walk(abs, rel);
      images.push(...nested.images);
      videos.push(...nested.videos);
    } else if (IMAGE_EXT.has(ext)) {
      images.push(rel);
    } else if (VIDEO_EXT.has(ext)) {
      videos.push(rel);
    }
  }

  return { images, videos };
}

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed (${code})`));
    });
  });
}

async function magickThumb(input: string, output: string): Promise<void> {
  await run("magick", [
    input,
    "-auto-orient",
    "-resize",
    "900x900>",
    "-strip",
    "-quality",
    "78",
    output,
  ]);
}

async function videoPoster(input: string, output: string): Promise<void> {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "commercial-poster-"));
  const frame = path.join(tmpDir, "frame.jpg");
  try {
    await run("ffmpeg", [
      "-y",
      "-ss",
      "00:00:02",
      "-i",
      input,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      "-update",
      "1",
      frame,
    ]);
    await magickThumb(frame, output);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  const { images, videos } = await walk(ROOT);
  let ok = 0;

  for (const rel of images) {
    const input = path.join(ROOT, rel);
    const outRel = rel.replace(/\.[^.]+$/, ".webp");
    const output = path.join(THUMBS, outRel);
    await mkdir(path.dirname(output), { recursive: true });
    await magickThumb(input, output);
    const size = (await stat(output)).size;
    console.log(`✓ ${outRel} (${Math.round(size / 1024)} KB)`);
    ok++;
  }

  for (const rel of videos) {
    const input = path.join(ROOT, rel);
    const outRel = rel.replace(/\.[^.]+$/, ".webp");
    const output = path.join(THUMBS, outRel);
    await mkdir(path.dirname(output), { recursive: true });
    try {
      await videoPoster(input, output);
      const size = (await stat(output)).size;
      console.log(`✓ ${outRel} [video poster] (${Math.round(size / 1024)} KB)`);
      ok++;
    } catch (err) {
      console.warn(`⚠ skipped video poster for ${rel}:`, err.message ?? err);
    }
  }

  console.log(`\nGenerated ${ok} thumbnails in public/commercial/thumbs/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
