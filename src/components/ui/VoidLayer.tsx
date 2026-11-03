import type React from "react";
import { usePerformance } from "../../contexts/PerformanceContext";
import { useVoidSignals } from "../../hooks/useVoidSignals";
import { IdleDecay } from "./IdleDecay";
import { VoidCursor } from "./VoidCursor";
import { VoidTerminal } from "./VoidTerminal";

const canUseFinePointer = () =>
  typeof window.matchMedia !== "function" ||
  window.matchMedia("(pointer: fine)").matches;

const prefersReducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Site-wide void gimmicks. The terminal is always available; the rest honour
 * the performance toggle, reduced-motion, and (for the cursor) touch devices.
 */
export const VoidLayer: React.FC = () => {
  const { settings } = usePerformance();
  const effects = settings.enableAnimations && !prefersReducedMotion();
  const fine = canUseFinePointer();

  useVoidSignals(effects);

  return (
    <>
      {effects && <IdleDecay />}
      {effects && fine && <VoidCursor />}
      <VoidTerminal />
    </>
  );
};

export default VoidLayer;
