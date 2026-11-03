import type React from "react";
import { usePerformance } from "../../contexts/PerformanceContext";
import { useVoidSignals } from "../../hooks/useVoidSignals";
import { IdleDecay } from "./IdleDecay";
import { VoidTerminal } from "./VoidTerminal";

const prefersReducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Site-wide void gimmicks. The terminal is always available; the rest honour
 * the performance toggle and reduced-motion.
 */
export const VoidLayer: React.FC = () => {
  const { settings } = usePerformance();
  const effects = settings.enableAnimations && !prefersReducedMotion();

  useVoidSignals(effects);

  return (
    <>
      {effects && <IdleDecay />}
      <VoidTerminal />
    </>
  );
};

export default VoidLayer;
