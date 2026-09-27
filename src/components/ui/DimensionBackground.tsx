import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { prefersReducedMotion } from "../../utils/animations";

type WireShape = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  kind: "cube" | "tetra" | "octa";
  delay: number;
  duration: number;
};

/**
 * DimensionBackground — perspective grid + floating wireframes
 * for the 3D works section (cyan void / viewport aesthetic).
 */
export const DimensionBackground = () => {
  const settings = usePerformanceSettings();
  const reduceMotion = prefersReducedMotion() || !settings.enableAnimations;

  const shapes = useMemo<WireShape[]>(
    () => [
      { id: 0, x: 8, y: 18, size: 56, rotate: 12, kind: "cube", delay: 0, duration: 14 },
      { id: 1, x: 78, y: 12, size: 44, rotate: -18, kind: "tetra", delay: 1.2, duration: 16 },
      { id: 2, x: 86, y: 58, size: 64, rotate: 28, kind: "octa", delay: 0.6, duration: 18 },
      { id: 3, x: 6, y: 62, size: 40, rotate: -8, kind: "cube", delay: 2, duration: 15 },
      { id: 4, x: 48, y: 8, size: 32, rotate: 40, kind: "tetra", delay: 0.4, duration: 12 },
      { id: 5, x: 62, y: 72, size: 48, rotate: -22, kind: "octa", delay: 1.8, duration: 17 },
    ],
    [],
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 6 : 14 }, (_, i) => ({
        id: i,
        x: 8 + ((i * 17) % 84),
        y: 10 + ((i * 23) % 75),
        size: 2 + (i % 3),
        delay: (i % 7) * 0.45,
      })),
    [reduceMotion],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Void base — cyan/slate, matches 3D card accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#020617] to-black" />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0, 217, 255, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse 55% 45% at 15% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 90% 70%, rgba(14, 165, 233, 0.07) 0%, transparent 50%)
          `,
        }}
      />

      {/* Perspective floor grid — classic viewport feel */}
      <div
        className="absolute inset-x-0 bottom-0 h-[70%] origin-bottom"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 217, 255, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 217, 255, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
          transform: "perspective(560px) rotateX(56deg) scale(1.4)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 40%, transparent 78%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 40%, transparent 78%)",
          opacity: 0.7,
        }}
      />

      {/* Horizon glow line */}
      <div
        className="absolute left-1/2 top-[36%] h-px w-[85%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(0, 217, 255, 0.55), transparent)",
          boxShadow: "0 0 28px rgba(0, 217, 255, 0.4)",
        }}
      />

      {/* Floating wireframe primitives */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          animate={
            reduceMotion
              ? { opacity: 0.35 }
              : {
                  y: [0, -14, 0],
                  rotate: [shape.rotate, shape.rotate + 12, shape.rotate],
                  opacity: [0.25, 0.55, 0.25],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: shape.duration,
                  delay: shape.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Wireframe kind={shape.kind} />
        </motion.div>
      ))}

      {/* Depth sparks */}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size,
            height: spark.size,
            background: "rgba(0, 217, 255, 0.85)",
            boxShadow: "0 0 8px rgba(0, 217, 255, 0.55)",
          }}
          animate={
            reduceMotion
              ? { opacity: 0.35 }
              : {
                  opacity: [0.15, 0.9, 0.15],
                  scale: [0.7, 1.25, 0.7],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 3.2 + (spark.id % 4) * 0.4,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {/* Soft scan beam */}
      {!reduceMotion && (
        <motion.div
          className="absolute left-0 right-0 h-24 opacity-30"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0, 217, 255, 0.08), transparent)",
          }}
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Vignette — keeps models readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.55) 100%)",
        }}
      />
    </div>
  );
};

const Wireframe = ({ kind }: { kind: WireShape["kind"] }) => {
  if (kind === "cube") {
    return (
      <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_0_8px_rgba(0,217,255,0.35)]">
        <g fill="none" stroke="rgba(0,217,255,0.55)" strokeWidth="1.2">
          <path d="M12 24 L32 12 L52 24 L52 44 L32 56 L12 44 Z" />
          <path d="M12 24 L32 36 L52 24" />
          <path d="M32 36 L32 56" />
        </g>
      </svg>
    );
  }

  if (kind === "tetra") {
    return (
      <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_0_8px_rgba(0,217,255,0.35)]">
        <g fill="none" stroke="rgba(0,217,255,0.5)" strokeWidth="1.2">
          <path d="M32 8 L56 52 L8 52 Z" />
          <path d="M32 8 L32 52" />
          <path d="M8 52 L32 28 L56 52" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_0_8px_rgba(0,217,255,0.35)]">
      <g fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2">
        <path d="M32 4 L56 32 L32 60 L8 32 Z" />
        <path d="M8 32 L56 32" />
        <path d="M32 4 L32 60" />
      </g>
    </svg>
  );
};

export default DimensionBackground;
