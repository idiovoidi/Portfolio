import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Scroll Progress Indicator
 * Shows a thin bar at the top of the page indicating scroll progress
 */
export const ScrollProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  // Add spring animation for smooth progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Show progress bar after scrolling past hero section
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background:
          "linear-gradient(to right, var(--color-primary), var(--color-accent))",
        transformOrigin: "0%",
        scaleX,
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    />
  );
};

export default ScrollProgress;
