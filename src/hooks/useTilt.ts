import { useEffect, useRef, useState } from "react";

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  disabled?: boolean;
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glareOpacity: number;
  glarePosition: { x: number; y: number };
}

/**
 * Custom hook for 3D tilt effect on mouse move
 * Creates a parallax tilt effect based on mouse position
 */
export const useTilt = (options: TiltOptions = {}) => {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = true,
    maxGlare = 0.3,
    disabled = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [tiltState, setTiltState] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareOpacity: 0,
    glarePosition: { x: 50, y: 50 },
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only calculate if mouse is within bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        return;
      }

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotateY = percentX * maxTilt;
      const rotateX = -percentY * maxTilt;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTiltState({
        rotateX,
        rotateY,
        scale,
        glareOpacity: glare ? maxGlare : 0,
        glarePosition: { x: glareX, y: glareY },
      });
    };

    const handleMouseEnter = () => {
      setTiltState((prev) => ({ ...prev, scale }));
    };

    const handleMouseLeave = () => {
      setTiltState({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        glareOpacity: 0,
        glarePosition: { x: 50, y: 50 },
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, speed, glare, maxGlare, disabled]);

  const isTilting =
    tiltState.rotateX !== 0 || tiltState.rotateY !== 0 || tiltState.scale !== 1;
  const tiltStyle =
    disabled || !isTilting
      ? {}
      : {
          transform: `perspective(${perspective}px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale3d(${tiltState.scale}, ${tiltState.scale}, ${tiltState.scale})`,
          transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
        };

  const glareStyle = glare
    ? {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `radial-gradient(circle at ${tiltState.glarePosition.x}% ${tiltState.glarePosition.y}%, rgba(255, 255, 255, ${tiltState.glareOpacity}), transparent 50%)`,
        pointerEvents: "none" as const,
        transition: `opacity ${speed}ms ease`,
        opacity: tiltState.glareOpacity > 0 ? 1 : 0,
        zIndex: 10,
        borderRadius: "inherit",
      }
    : null;

  return { ref, tiltStyle, glareStyle, tiltState };
};
