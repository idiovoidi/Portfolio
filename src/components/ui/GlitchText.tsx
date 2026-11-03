import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Random glitch trigger - more frequent and visible
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 400);
      }
    }, 2000);

    return () => {
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main text with CSS animated gradient */}
      <h2
        className="section-heading bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent relative z-10"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
        }}
      >
        {text}
      </h2>

      {/* Glitch layers - only when glitching */}
      {isGlitching && (
        <>
          {/* Red glitch layer */}
          <motion.h2
            className="section-heading absolute top-0 left-0 text-red-500 opacity-80 z-0"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [-3, 3, -2, 3, -1],
              y: [1, -1, 2, -2, 1],
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            style={{
              textShadow: "3px 0 #ff0000",
              mixBlendMode: "screen",
            }}
          >
            {text}
          </motion.h2>

          {/* Cyan glitch layer */}
          <motion.h2
            className="section-heading absolute top-0 left-0 text-cyan-500 opacity-80 z-0"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [3, -3, 2, -3, 1],
              y: [-1, 1, -2, 2, -1],
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            style={{
              textShadow: "-3px 0 #00ffff",
              mixBlendMode: "screen",
            }}
          >
            {text}
          </motion.h2>

          {/* Glitch scan lines */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="absolute w-full h-px bg-white"
              style={{
                top: "30%",
                mixBlendMode: "difference",
              }}
            />
            <div
              className="absolute w-full h-px bg-white"
              style={{
                top: "70%",
                mixBlendMode: "difference",
              }}
            />
          </motion.div>
        </>
      )}

      {/* CSS animation for gradient */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export { GlitchText };
export default GlitchText;
