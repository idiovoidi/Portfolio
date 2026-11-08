import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "./VoidEyeball.css";

type MiniPulse = { id: number };

const RGB_LAYERS = [
  { name: "red", color: "rgba(255, 0, 100, 0.3)", offset: -3 },
  { name: "cyan", color: "rgba(0, 255, 255, 0.3)", offset: 3 },
  { name: "core", color: "rgba(0, 0, 0, 0.9)", offset: 0 },
];

const VoidEyeball: React.FC = () => {
  // Chaotic movement with jittery spring
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 200 };
  const eyeXSpring = useSpring(eyeX, springConfig);
  const eyeYSpring = useSpring(eyeY, springConfig);
  const [miniPulses, setMiniPulses] = useState<MiniPulse[]>([]);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [eyeX, eyeY]);

  // Stop the ambient loops while the hero is scrolled out of view
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      setPaused(!entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const spawnMiniPulse = () => {
    const id = Date.now() + Math.random();
    setMiniPulses((prev) => [...prev.slice(-4), { id }]);
  };

  const dismissMiniPulse = (id: number) => {
    setMiniPulses((prev) => prev.filter((pulse) => pulse.id !== id));
  };

  return (
    <div
      ref={rootRef}
      className="void-eyeball"
      data-paused={paused}
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
          WebkitTapHighlightColor: "transparent",
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
          {/* Infall rings: spring handles position, CSS handles the loop */}
          {[0, 1].map((ring) => (
            <motion.div
              key={`infall-${ring}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "88%",
                height: "88%",
                x: eyeXSpring,
                y: eyeYSpring,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
              }}
            >
              <div
                className="void-layer void-infall"
                style={{ animationDelay: `${ring * 2.3}s` }}
              />
            </motion.div>
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
            {RGB_LAYERS.map((layer, idx) => (
              <div
                key={`rgb-${layer.name}`}
                className="void-layer void-rgb"
                style={
                  {
                    "--void-offset": `${layer.offset}px`,
                    animationDuration: `${0.75 + idx * 0.18}s`,
                    background: `radial-gradient(circle, ${layer.color} 0%, transparent 70%)`,
                    boxShadow:
                      idx === 2
                        ? "inset 0 0 60px rgba(0, 0, 0, 1), 0 0 80px rgba(124, 58, 237, 0.6)"
                        : "none",
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Quiet resting glow */}
            <div className="void-layer void-rest-glow" />

            {/* Occasional deep breath from the core */}
            <div className="void-layer void-breath" />
            <div className="void-layer void-breath-ring" />
            <div className="void-layer void-breath-core" />

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
                      willChange: "transform, opacity",
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
                      willChange: "transform, opacity",
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
                      willChange: "transform, opacity",
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
                }}
              />
            );
          })}

          {/* Distortion field with noise */}
          <div className="void-layer void-distortion" />
        </div>
      </motion.div>
    </div>
  );
};

export { VoidEyeball };
export default VoidEyeball;
