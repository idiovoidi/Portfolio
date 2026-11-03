# Open Issues: Bundle Size and 3D Model Deployment

Status: **open, not started.** Both came out of the portfolio review. Targeted later.

Related: [issues_to_fix.md](issues_to_fix.md), [3D_Supported_Filetypes_07-03-2026.md](3D_Supported_Filetypes_07-03-2026.md), `scripts/README-3D-Conversion.md`.

---

## Issue 1: Main JS bundle is 5.2 MB (2 MB gzipped)

### Symptom
`npx vite build` produces:

| Chunk | Size | Gzip |
| --- | --- | --- |
| `index-*.js` | **5,205 KB** | **2,016 KB** |
| `ThreeD-*.js` | 622 KB | 161 KB |
| `animation-vendor-*.js` | 124 KB | 41 KB |
| `icons-vendor-*.js` | 2.5 KB | 1 KB |

Every visitor downloads the `index` chunk before seeing the hero. The `icons-vendor` manual chunk is nearly empty, so it isn't catching the real problem.

### Cause
[SkillBadge.tsx:3](../src/components/ui/SkillBadge.tsx#L3):

```ts
import * as SimpleIcons from 'react-icons/si';
...
const IconComponent = icon ? (SimpleIcons as any)[icon] : null;
```

A namespace import with a runtime string lookup can't be tree-shaken, so the whole Simple Icons set (thousands of icons) lands in the main bundle. Other `react-icons` imports (`fa`, `fi`, `io5`, `md`, `ri`) use named imports and are fine.

### Icons actually used
From [skills.ts](../src/data/skills.ts), 13 in total:

`SiAdobeillustrator`, `SiAdobephotoshop`, `SiBlender`, `SiHtml5`, `SiJavascript`, `SiMariadb`, `SiMongodb`, `SiPython`, `SiQt`, `SiReact`, `SiSteinberg`, `SiTailwindcss`, `SiUnrealengine`

### Proposed fix
1. In `SkillBadge.tsx` (or a small `skillIcons.ts`), import only those 13 as named imports and build a `Record<string, IconType>`.
2. Look up icons from that record instead of the namespace.
3. Make unknown names fail loudly in dev (console warning), since the lookup is no longer implicit.
4. Optional: type `Skill.icon` in `skills.ts` as `keyof typeof skillIcons` so a typo is a compile error.

### Acceptance criteria
- [ ] No `import * as ... from 'react-icons/si'` anywhere in `src/`.
- [ ] `index-*.js` drops substantially. Check it is well under 1 MB; the expectation is a few hundred KB.
- [ ] All 13 skill icons still render in the Skills section.
- [ ] `SkillBadge` tests still pass.

### Notes
- After the fix, re-check what is left in `index-*.js` (e.g. with `rollup-plugin-visualizer`). Three.js is already split into the `ThreeD` chunk, and `canvas` is a dev-only dependency.
- The `chunkSizeWarningLimit: 1000` in [vite.config.ts](../vite.config.ts) only hides the warning. Consider lowering it once the bundle is fixed.

---

## Issue 2: 3D models probably won't deploy

### Symptom
`public/3D/` is listed in [.gitignore](../.gitignore), and `git ls-files public/3D` returns nothing. The models exist only on the local machine. A local build copies them into `dist/3D`, but a build from git would not have them, leaving the 3D section empty or erroring.

### What isn't known yet
The repo has a `.vercel/` folder, so the project is linked to Vercel. It isn't clear whether deploys are:
- **Git-triggered** (Vercel builds from the repo): models are missing. This is a real bug.
- **CLI from this machine** (`vercel` / `vercel --prebuilt`): `--prebuilt` uploads local `dist` and would include them. A plain `vercel` upload respects `.gitignore` and would not.

**First step: check the Vercel dashboard (Git integration on/off) and the live site's 3D section.**

### What the site actually loads
Per [threeD.ts](../src/data/threeD.ts):

| File | Size |
| --- | --- |
| `AnyConv.com__Barrel_FBX.glb` | 48 KB |
| `enemy.glb` | 844 KB |
| `corrupted-healthpack.glb` | 32 KB |
| `..._AlbedoTransparency.png` | 4.8 MB |
| `..._Emission.png` | 876 KB |
| `..._MetallicSmoothness.png` | 4.2 MB |
| `..._Normal.png` | 8.1 MB |
| **Total needed at runtime** | **about 19 MB** |

Of the 39 MB in `public/3D/`, the rest is not referenced by the site: `corrupted-healthpack-textured.glb` (20 MB), the `.fbx` source files and `Stock_Test/`. Those should stay out of the deployed output either way.

Most of the real weight is the four PNG textures (about 18 MB), not the meshes.

### Options

| Option | Pros | Cons |
| --- | --- | --- |
| **A. Commit the needed files** (un-ignore `public/3D/*.glb` and the 4 textures, keep sources ignored) | Simplest, works on any git deploy | Adds about 19 MB to the repo history; heavy to download for visitors |
| **B. A + compress first** (textures to KTX2/Basis or WebP/JPEG, meshes with Draco/meshopt via `gltf-transform`) | Repo and download both shrink, likely to a few MB | Needs `KTX2Loader`/`DRACOLoader`/`MeshoptDecoder` set up in `ModelViewer` |
| **C. External hosting** (R2, S3, Vercel Blob, GitHub release assets) and use absolute URLs | Keeps the repo small | CORS and CSP changes (`connect-src`/`img-src` already allow `https:`), another service to maintain |

### Recommendation
Option **B**, then **A**. Compress first so the committed files are small, then commit only the runtime assets. Move the originals and sources to a `3D_source/` folder that stays ignored. Go with **C** only if models grow into the hundreds of MB.

### Proposed steps
1. Confirm how production is deployed (see above).
2. Decide on keeping `public/3D/` ignored (switch to an explicit allow-list in `.gitignore`) or moving sources out.
3. Compress the four textures. Avoid heavy lossy compression on the normal map, and verify the look in the viewer.
4. Optionally run `gltf-transform optimize` on the GLBs and add the matching decoders to [ModelViewer.tsx](../src/components/ui/ModelViewer.tsx).
5. Update `modelPath`/`textures` in [threeD.ts](../src/data/threeD.ts) if file names or formats change.
6. Rebuild and deploy, then check the live 3D section from a clean browser profile.

### Acceptance criteria
- [ ] A fresh `git clone` followed by `npm ci && npm run build` produces a `dist/` containing every model and texture that `threeD.ts` references.
- [ ] The live site's 3D section loads all three models with textures.
- [ ] Unreferenced files (`-textured.glb`, `.fbx`, `Stock_Test/`) are not in `dist/`.
- [ ] Total 3D payload is documented. Target: well under 19 MB if compressing.

### Notes
- [ModelViewer.tsx:229](../src/components/ui/ModelViewer.tsx#L229) currently has a `tsc` error (`'new' expression, whose target lacks a construct signature`). It's worth fixing while this file is open.
- `scripts/apply-textures-to-glb.js` and the comment in `threeD.ts` mention problems with embedded textures in some browsers (blob `Image()` issues). That is why the project uses external texture maps. Keep that in mind if switching to KTX2 or embedded textures.
