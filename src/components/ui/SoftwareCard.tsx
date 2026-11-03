import { motion } from "framer-motion";
import type React from "react";
import type { SoftwareEntry } from "../../data/softwareData";
import SkillBadge from "./SkillBadge";

export interface SoftwareCardProps {
  software: SoftwareEntry;
  index: number;
  isGrouped?: boolean; // Visual indicator for libraries grouped under languages
  onClick?: (softwareId: string) => void; // Future filtering handler
}

/**
 * SoftwareCard Component
 *
 * Wraps SkillBadge to display software entries with additional metadata
 * (version, year last used). Reuses the existing SkillBadge styling and
 * icon system from react-icons/si.
 *
 * FUTURE FILTERING IMPLEMENTATION:
 * The onClick handler is prepared for future filtering functionality.
 * When implemented, clicking a software card should:
 * 1. Filter portfolio pieces by the software ID
 * 2. Navigate to a filtered view or highlight matching items
 * 3. Use the getPortfolioBySoftwareId helper from softwareData.ts
 */
const SoftwareCard: React.FC<SoftwareCardProps> = ({
  software,
  index = 0,
  isGrouped = false,
  onClick,
}) => {
  // Handle click for future filtering
  const handleClick = () => {
    if (onClick) {
      onClick(software.id);
    }
  };

  // Build ARIA label for accessibility
  const buildAriaLabel = (): string => {
    let label = software.name;

    if (software.version) {
      label += `, version ${software.version}`;
    }

    if (software.language) {
      label += `, ${software.language} library`;
    }

    return label;
  };

  return (
    <>
      {/* Focus-visible styles for keyboard navigation */}
      <style>{`
        .software-card {
          outline: none;
        }
        .software-card:focus-visible {
          outline: 3px solid rgba(167, 139, 250, 0.8);
          outline-offset: 4px;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.5);
        }
      `}</style>

      <div
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && onClick) {
            e.preventDefault();
            handleClick();
          }
        }}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={buildAriaLabel()}
        data-software-id={software.id}
        className="software-card"
        style={{
          cursor: onClick ? "pointer" : "default",
          position: "relative",
          opacity: isGrouped ? 0.85 : 1,
          paddingLeft: isGrouped ? "1rem" : "0",
        }}
      >
        {/* Reuse SkillBadge for consistent styling */}
        <SkillBadge name={software.name} icon={software.icon} index={index} />

        {/* Additional metadata overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* Language indicator for grouped libraries */}
          {software.language && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              style={{
                fontSize: "0.7rem",
                fontWeight: "400",
                color: "rgba(167, 139, 250, 0.7)",
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              {software.language}
            </motion.span>
          )}

          {/* Version Number (conditional) */}
          {software.version && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              style={{
                fontSize: "0.75rem",
                fontWeight: "500",
                color: "rgba(167, 139, 250, 0.9)",
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              v{software.version}
            </motion.span>
          )}
        </div>
      </div>
    </>
  );
};

export { SoftwareCard };
export default SoftwareCard;
