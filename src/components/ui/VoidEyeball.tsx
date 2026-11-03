import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

type MiniPulse = { id: number };

const VoidEyeball: React.FC = () => {
  // Chaotic movement with jittery spring
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 200 };
  const eyeXSpring = useSpring(eyeX, springConfig);
  const eyeYSpring = useSpring(eyeY, springConfig);
  const [miniPulses, setMiniPulses] = useState<MiniPulse[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      const maxMove = 20;
      eyeX.set(deltaX * maxMove);
      eyeY.set(deltaY * maxMove);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [eyeX, eyeY]);

  const spawnMiniPulse = () => {
    const id = Date.now() + Math.random();
    setMiniPulses((prev) => [...prev.slice(-4), { id }]);
  };

  const dismissMiniPulse = (id: number) => {
    setMiniPulses((prev) => prev.filter((pulse) => pulse.id !== id));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 0.55,
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        onClick={spawnMiniPulse}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            spawnMiniPulse();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Pulse the void portal"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          pointerEvents: "auto",
          cursor: "pointer",
          position: "relative",
          borderRadius: "50%",
        }}
      >
        {/* Chaotic void container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {[0, 1].map((ring) => (
            <motion.div
              key={`infall-${ring}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "88%",
                height: "88%",
                borderRadius: "50%",
                border: "1px solid rgba(196, 181, 253, 0.28)",
                boxShadow: "0 0 12px rgba(124, 58, 237, 0.18)",
                x: eyeXSpring,
                y: eyeYSpring,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
              }}
              animate={{ scale: [1, 0.12], opacity: [0, 0.32, 0] }}
              transition={{
                duration: 4.6,
                repeat: Infinity,
                ease: "easeIn",
                delay: ring * 2.3,
              }}
            />
          ))}

          {/* Chaotic void core with RGB split */}
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "30%",
              height: "30%",
              borderRadius: "50%",
              x: eyeXSpring,
              y: eyeYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            {/* RGB chromatic aberration layers */}
            {[
              { color: "rgba(255, 0, 100, 0.3)", offset: -3 },
              { color: "rgba(0, 255, 255, 0.3)", offset: 3 },
              { color: "rgba(0, 0, 0, 0.9)", offset: 0 },
            ].map((layer, idx) => (
              <motion.div
                key={`rgb-${idx}`}
                animate={{
                  x: [layer.offset, -layer.offset, layer.offset],
                  y: [layer.offset, layer.offset, -layer.offset],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 0.75 + idx * 0.18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${layer.color} 0%, transparent 70%)`,
                  boxShadow:
                    idx === 2
                      ? "inset 0 0 60px rgba(0, 0, 0, 1), 0 0 80px rgba(124, 58, 237, 0.6)"
                      : "none",
                }}
              />
            ))}

            {/* Quiet resting glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.45, 0.62, 0.45],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: "18%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(167, 139, 250, 0.55) 0%, rgba(124, 58, 237, 0.28) 46%, transparent 72%)",
                filter: "blur(14px)",
                mixBlendMode: "screen",
              }}
            />

            {/* Occasional deep breath from the core */}
            <motion.div
              animate={{
                scale: [1, 1, 2.35, 1.12, 1],
                opacity: [0, 0, 0.95, 0.28, 0],
              }}
              transition={{
                duration: 7.5,
                times: [0, 0.62, 0.76, 0.88, 1],
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                inset: "-55%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 120, 200, 0.75) 0%, rgba(124, 58, 237, 0.55) 22%, rgba(76, 29, 149, 0.25) 48%, transparent 72%)",
                filter: "blur(22px)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{
                scale: [0.2, 0.2, 2.1, 1.05],
                opacity: [0, 0, 0.72, 0],
              }}
              transition={{
                duration: 7.5,
                times: [0, 0.62, 0.8, 1],
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                inset: "-95%",
                borderRadius: "50%",
                border: "2px solid rgba(221, 214, 254, 0.65)",
                boxShadow:
                  "0 0 48px rgba(167, 139, 250, 0.65), inset 0 0 36px rgba(236, 72, 153, 0.35)",
                pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1, 1.55, 1],
                opacity: [0.35, 0.35, 0.9, 0.35],
              }}
              transition={{
                duration: 7.5,
                times: [0, 0.62, 0.74, 1],
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                inset: "5%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(167, 139, 250, 0.85) 0%, rgba(124, 58, 237, 0.45) 38%, transparent 70%)",
                filter: "blur(10px)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />

            {/* Click-triggered mini pulses */}
            <AnimatePresence>
              {miniPulses.map((pulse) => (
                <motion.div
                  key={pulse.id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.55, opacity: 0 }}
                    animate={{
                      scale: [0.55, 1.55, 1.05],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 0.85,
                      ease: "easeOut",
                      times: [0, 0.4, 1],
                    }}
                    onAnimationComplete={() => dismissMiniPulse(pulse.id)}
                    style={{
                      position: "absolute",
                      inset: "-35%",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(255, 140, 210, 0.55) 0%, rgba(167, 139, 250, 0.4) 28%, rgba(76, 29, 149, 0.18) 52%, transparent 72%)",
                      filter: "blur(14px)",
                      mixBlendMode: "screen",
                      pointerEvents: "none",
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0.25, opacity: 0 }}
                    animate={{ scale: [0.25, 1.45], opacity: [0.65, 0] }}
                    transition={{ duration: 0.75, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      inset: "-55%",
                      borderRadius: "50%",
                      border: "1.5px solid rgba(221, 214, 254, 0.55)",
                      boxShadow:
                        "0 0 28px rgba(167, 139, 250, 0.45), inset 0 0 18px rgba(236, 72, 153, 0.25)",
                      pointerEvents: "none",
                    }}
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{ scale: [1, 1.28, 1], opacity: [0.4, 0.85, 0] }}
                    transition={{
                      duration: 0.7,
                      ease: "easeOut",
                      times: [0, 0.35, 1],
                    }}
                    style={{
                      position: "absolute",
                      inset: "8%",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(196, 181, 253, 0.75) 0%, rgba(124, 58, 237, 0.4) 40%, transparent 70%)",
                      filter: "blur(8px)",
                      mixBlendMode: "screen",
                      pointerEvents: "none",
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Digital corruption artifacts */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const width = 30 + i * 8;
            const height = 2 + (i % 3);
            const angle = (i / 7) * 360;
            const xOffset = i % 2 === 0 ? 10 : -10;

            return (
              <motion.div
                key={`artifact-${i}`}
                animate={{
                  opacity: [0, 0.22, 0],
                  scaleX: [0, 1, 0],
                  x: [0, xOffset],
                }}
                transition={{
                  duration: 0.4 + i * 0.05,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                  repeatDelay: 2.5 + i * 0.3,
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${width}px`,
                  height: `${height}px`,
                  background: `linear-gradient(90deg, 
                    transparent, 
                    rgba(${
                      i % 2 === 0 ? "167, 139, 250" : "236, 72, 153"
                    }, 0.8), 
                    transparent
                  )`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(${
                    80 + i * 20
                  }px)`,
                  filter: "blur(1px)",
                }}
              />
            );
          })}

          {/* Distortion field with noise */}
          <motion.div
            animate={{
              scale: [1, 1, 1.28, 1.04, 1],
              opacity: [0.12, 0.12, 0.38, 0.18, 0.12],
              rotate: [0, 360],
            }}
            transition={{
              duration: 7.5,
              times: [0, 0.62, 0.76, 0.88, 1],
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: "-50%",
              borderRadius: "50%",
              background: `
                radial-gradient(
                  circle,
                  transparent 30%,
                  rgba(124, 58, 237, 0.15) 50%,
                  rgba(167, 139, 250, 0.2) 70%,
                  rgba(236, 72, 153, 0.1) 85%,
                  transparent 100%
                )
              `,
              filter: "blur(60px) contrast(1.3)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export { VoidEyeball };
export default VoidEyeball;
