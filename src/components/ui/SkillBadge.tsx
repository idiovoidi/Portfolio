import { motion, useReducedMotion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as SimpleIcons from "react-icons/si";

export interface SkillBadgeProps {
  name: string;
  icon?: string;
  className?: string;
  index?: number;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  icon,
  className = "",
  index = 0,
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Dynamically get the icon component from react-icons/si
  const IconComponent = icon ? (SimpleIcons as any)[icon] : null;

  // Use Intersection Observer for better performance
  useEffect(() => {
    if (!badgeRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsInView(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    observer.observe(badgeRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Stagger animation delay based on index
  const animationDelay = prefersReducedMotion ? 0 : Math.min(index * 0.03, 0.5);

  return (
    <motion.div
      ref={badgeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      whileHover={!prefersReducedMotion ? { scale: 1.08, y: -4 } : {}}
      whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
      className={`skill-badge ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem 1rem",
        borderRadius: "1rem",
        backgroundColor: "rgba(15, 15, 25, 0.8)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        backdropFilter: "blur(10px)",
        cursor: "default",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.1)",
      }}
    >
      {/* Neural pulse effect - only if animations enabled and not reduced motion */}
      {!prefersReducedMotion && isInView && (
        <motion.div
          className="skill-badge-pulse"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: animationDelay,
          }}
          style={{
            position: "absolute",
            inset: "-20%",
            background:
              "radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Hover glow effect */}
      <motion.div
        className="skill-badge-glow"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(167, 139, 250, 0.3) 0%, transparent 70%)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      {IconComponent && (
        <motion.div
          whileHover={!prefersReducedMotion ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.75rem",
            color: "rgba(167, 139, 250, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
          }}
          aria-hidden="true"
        >
          <IconComponent aria-hidden="true" />
        </motion.div>
      )}

      {/* Skill Name */}
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "rgba(226, 232, 240, 0.95)",
          textAlign: "center",
          lineHeight: "1.3",
          zIndex: 1,
        }}
      >
        {name}
      </span>
    </motion.div>
  );
};

export default SkillBadge;
