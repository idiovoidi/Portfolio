import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls, RoomEnvironment } from "three-stdlib";
import type { ModelTextures } from "../../data/threeD";

interface ModelViewerProps {
  src: string;
  alt: string;
  poster?: string;
  textures?: ModelTextures;
  autoRotate?: boolean;
  cameraControls?: boolean;
  className?: string;
}

const loadTexture = (
  loader: THREE.TextureLoader,
  url: string,
  colorSpace: THREE.ColorSpace = THREE.NoColorSpace,
) =>
  new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = colorSpace;
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });

/** Unity MetallicSmoothness: R = metalness, A = smoothness → roughness = 1 - smoothness */
const splitMetallicSmoothness = (source: THREE.Texture) => {
  const image = source.image as HTMLImageElement | ImageBitmap;
  const width = "width" in image ? image.width : 0;
  const height = "height" in image ? image.height : 0;
  if (!width || !height) {
    throw new Error("MetallicSmoothness image has no dimensions");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  ctx.drawImage(image as CanvasImageSource, 0, 0);
  const { data } = ctx.getImageData(0, 0, width, height);

  const metalData = new Uint8ClampedArray(data.length);
  const roughData = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const metal = data[i];
    const rough = 255 - data[i + 3];
    metalData[i] = metalData[i + 1] = metalData[i + 2] = metal;
    metalData[i + 3] = 255;
    roughData[i] = roughData[i + 1] = roughData[i + 2] = rough;
    roughData[i + 3] = 255;
  }

  const metalCanvas = document.createElement("canvas");
  metalCanvas.width = width;
  metalCanvas.height = height;
  const metalCtx = metalCanvas.getContext("2d")!;
  metalCtx.putImageData(new ImageData(metalData, width, height), 0, 0);

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = width;
  roughCanvas.height = height;
  const roughCtx = roughCanvas.getContext("2d")!;
  roughCtx.putImageData(new ImageData(roughData, width, height), 0, 0);

  const metalnessMap = new THREE.CanvasTexture(metalCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  for (const tex of [metalnessMap, roughnessMap]) {
    tex.colorSpace = THREE.NoColorSpace;
    tex.flipY = false;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
  }

  return { metalnessMap, roughnessMap };
};

const applyTexturesToObject = async (
  root: THREE.Object3D,
  textures: ModelTextures,
  disposable: THREE.Texture[],
) => {
  const loader = new THREE.TextureLoader();
  const maps: Partial<Record<string, THREE.Texture>> = {};

  if (textures.albedo) {
    maps.map = await loadTexture(loader, textures.albedo, THREE.SRGBColorSpace);
    disposable.push(maps.map);
  }
  if (textures.normal) {
    maps.normalMap = await loadTexture(loader, textures.normal);
    disposable.push(maps.normalMap);
  }
  if (textures.emission) {
    maps.emissiveMap = await loadTexture(
      loader,
      textures.emission,
      THREE.SRGBColorSpace,
    );
    disposable.push(maps.emissiveMap);
  }
  if (textures.ao) {
    maps.aoMap = await loadTexture(loader, textures.ao);
    disposable.push(maps.aoMap);
  }

  if (textures.metallicSmoothness) {
    const packed = await loadTexture(loader, textures.metallicSmoothness);
    disposable.push(packed);
    const { metalnessMap, roughnessMap } = splitMetallicSmoothness(packed);
    maps.metalnessMap = metalnessMap;
    maps.roughnessMap = roughnessMap;
    disposable.push(metalnessMap, roughnessMap);
  } else {
    if (textures.metalness) {
      maps.metalnessMap = await loadTexture(loader, textures.metalness);
      disposable.push(maps.metalnessMap);
    }
    if (textures.roughness) {
      maps.roughnessMap = await loadTexture(loader, textures.roughness);
      disposable.push(maps.roughnessMap);
    }
  }

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh) || !child.material) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    const next = materials.map((mat) => {
      const material =
        mat instanceof THREE.MeshStandardMaterial
          ? mat
          : new THREE.MeshStandardMaterial({
              color:
                (mat as THREE.MeshStandardMaterial).color?.clone?.() ??
                0xffffff,
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
      return material;
    });

    child.material = next.length === 1 ? next[0] : next;
  });
};

/**
 * 3D Model Viewer — Three.js canvas for GLB/GLTF models.
 */
export const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  alt,
  poster,
  textures,
  autoRotate = true,
  cameraControls = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoRotateRef = useRef(autoRotate);
  const cameraControlsRef = useRef(cameraControls);
  autoRotateRef.current = autoRotate;
  cameraControlsRef.current = cameraControls;

  // Stable key so texture object identity changes don't thrash the scene.
  const texturesKey = textures ? JSON.stringify(textures) : "";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    let modelRoot: THREE.Object3D | null = null;
    const disposableTextures: THREE.Texture[] = [];

    setIsLoaded(false);
    setError(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 5000);
    camera.position.set(0, 0.5, 2.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-label", alt);
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.35);
    fillLight.position.set(-4, 1, -2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffaa88, 0.25);
    rimLight.position.set(0, 2, -4);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.2;
    const interactive = cameraControlsRef.current;
    controls.enableZoom = interactive;
    controls.enableRotate = interactive || autoRotateRef.current;
    renderer.domElement.style.pointerEvents = interactive ? "auto" : "none";

    const frameModel = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);

      object.position.sub(center);

      const fitDist =
        maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
      camera.position.set(0, maxDim * 0.15, fitDist * 1.55);
      camera.near = maxDim / 100;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.minDistance = fitDist * 0.5;
      controls.maxDistance = fitDist * 4;
      controls.update();
    };

    const setSize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    setSize();

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    const parsedTextures: ModelTextures | undefined = texturesKey
      ? (JSON.parse(texturesKey) as ModelTextures)
      : undefined;

    const loader = new GLTFLoader();
    loader.load(
      src,
      async (gltf) => {
        if (disposed) {
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];
              materials.forEach((m) => m.dispose());
            }
          });
          return;
        }

        try {
          if (parsedTextures) {
            await applyTexturesToObject(
              gltf.scene,
              parsedTextures,
              disposableTextures,
            );
          }
          if (disposed) return;

          modelRoot = gltf.scene;
          scene.add(modelRoot);
          frameModel(modelRoot);
          setIsLoaded(true);
          setError(null);
        } catch (err) {
          if (disposed) return;
          console.error("Texture loading error:", err);
          // Still show the mesh even if textures fail
          modelRoot = gltf.scene;
          scene.add(modelRoot);
          frameModel(modelRoot);
          setIsLoaded(true);
          setError(null);
        }
      },
      undefined,
      (err) => {
        if (disposed) return;
        console.error("Model loading error:", err, "path:", src);
        setError("Failed to load 3D model");
        setIsLoaded(false);
      },
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const canInteract = cameraControlsRef.current;
      controls.autoRotate = autoRotateRef.current;
      controls.enableZoom = canInteract;
      controls.enableRotate = canInteract || autoRotateRef.current;
      renderer.domElement.style.pointerEvents = canInteract ? "auto" : "none";
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();

      if (modelRoot) {
        scene.remove(modelRoot);
        modelRoot.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            materials.forEach((m) => m.dispose());
          }
        });
      }

      disposableTextures.forEach((t) => t.dispose());
      renderer.dispose();
      pmrem.dispose();
      if (scene.environment) {
        scene.environment.dispose();
      }
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src, alt, texturesKey]);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10"
        >
          <div className="text-center">
            {poster ? (
              <img
                src={poster}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            ) : null}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-3"
            />
            <p className="relative text-cyan-400 text-sm">
              Loading 3D model...
            </p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10">
          <div className="text-center p-4">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <p className="text-gray-500 text-xs">
              Unable to display this model
            </p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "400px", backgroundColor: "transparent" }}
      />

      {isLoaded && cameraControls && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-xs text-cyan-400 pointer-events-none"
          style={{
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.2)",
            border: "1px solid rgba(0, 217, 255, 0.3)",
          }}
        >
          Drag to rotate • Scroll to zoom
        </motion.div>
      )}
    </div>
  );
};
