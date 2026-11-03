import type React from "react";

/**
 * TextEffect Component
 *
 * Reusable component for applying various text effects like glitch, flicker, glow, etc.
 */

export type TextEffectType =
  | "glitch"
  | "flicker"
  | "glow"
  | "pulse"
  | "void"
  | "none";

interface TextEffectProps {
  children: React.ReactNode;
  effect?: TextEffectType;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  style?: React.CSSProperties;
}

export const TextEffect: React.FC<TextEffectProps> = ({
  children,
  effect = "none",
  className = "",
  as: Component = "span",
  style = {},
}) => {
  const getEffectClasses = () => {
    switch (effect) {
      case "glitch":
        return "glitch-text";
      case "flicker":
        return "flicker-text";
      case "glow":
        return "glow-text";
      case "pulse":
        return "pulse-text";
      case "void":
        return "void-text";
      default:
        return "";
    }
  };

  const getEffectStyles = (): React.CSSProperties => {
    switch (effect) {
      case "flicker":
        return {
          textShadow:
            "0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.5)",
          animation: "flicker 3s infinite",
          ...style,
        };
      case "glow":
        return {
          textShadow:
            "0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)",
          ...style,
        };
      case "pulse":
        return {
          textShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
          animation: "pulseGlow 3s ease-in-out infinite",
          ...style,
        };
      case "void":
        return {
          textShadow:
            "0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)",
          animation: "voidFloat 6s ease-in-out infinite",
          ...style,
        };
      default:
        return style;
    }
  };

  // For glitch effect, we need the data-text attribute
  if (effect === "glitch") {
    const textContent = typeof children === "string" ? children : "";
    return (
      <Component
        className={`${getEffectClasses()} ${className}`}
        data-text={textContent}
        style={getEffectStyles()}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={`${getEffectClasses()} ${className}`}
      style={getEffectStyles()}
    >
      {children}
    </Component>
  );
};
