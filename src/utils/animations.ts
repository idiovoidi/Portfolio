/**
 * Animation utility functions and variants for consistent animations across the portfolio
 * All animations respect prefers-reduced-motion media query
 */

import type { Variants } from "framer-motion";

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get animation duration based on user preference
 * Returns minimal duration if user prefers reduced motion
 */
export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0.01 : duration;
};

/** Show the final frame immediately when motion is disabled. */
export const revealState = (
  inView: boolean,
  animationsEnabled: boolean,
): "initial" | "animate" => {
  if (!animationsEnabled || prefersReducedMotion()) return "animate";
  return inView ? "animate" : "initial";
};

/**
 * Fade in from bottom animation variant
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(0.6),
      ease: "easeOut",
    },
  },
};

/**
 * Fade in animation variant
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: getAnimationDuration(0.6),
      ease: "easeOut",
    },
  },
};

/**
 * Scale in animation variant
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Stagger container for child animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Slide in from left animation variant
 */
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.6),
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from right animation variant
 */
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getAnimationDuration(0.6),
      ease: "easeOut",
    },
  },
};

/**
 * Hover scale animation
 */
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

/**
 * Hover lift animation (translateY)
 */
export const hoverLift = {
  y: -8,
  transition: {
    duration: 0.3,
    ease: "easeOut",
  },
};

/**
 * Create a custom fade in up variant with configurable delay
 */
export const createFadeInUp = (delay: number = 0): Variants => ({
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getAnimationDuration(0.6),
      delay,
      ease: "easeOut",
    },
  },
});

/**
 * Viewport configuration for scroll-triggered animations
 */
export const defaultViewport = {
  once: true,
  margin: "-50px",
  amount: 0.1,
};
