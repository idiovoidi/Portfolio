import { motion } from "framer-motion";
import type React from "react";
import { useMemo } from "react";

const NeuralBackground: React.FC = () => {
  // Generate neural nodes
  const nodes = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    [],
  );

  // Generate connections between nearby nodes
  const connections = useMemo(() => {
    const conns: Array<{ from: (typeof nodes)[0]; to: (typeof nodes)[0] }> = [];
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((otherNode) => {
        const distance = Math.sqrt(
          (node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2,
        );
        // Connect nodes that are close enough
        if (distance < 25 && Math.random() > 0.6) {
          conns.push({ from: node, to: otherNode });
        }
      });
    });
    return conns;
  }, [nodes]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" />

      {/* Subtle brain texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Neural connections */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>

        {connections.map((conn, i) => (
          <motion.line
            key={i}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Neural nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.3) 100%)",
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Synaptic pulses */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: "4px",
            height: "4px",
            background: "rgba(167, 139, 250, 0.8)",
            boxShadow: "0 0 8px rgba(167, 139, 250, 0.6)",
          }}
          animate={{
            x: [0, 50, 100],
            y: [0, -30, 20],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + i * 0.5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      />
    </div>
  );
};

export { NeuralBackground };
export default NeuralBackground;
