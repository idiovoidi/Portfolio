import { useEffect, useState } from "react";

/**
 * Custom hook to track which section is currently in view
 * @param sectionIds - Array of section IDs to track
 * @param offset - Offset from top of viewport (default: 150)
 * @returns The ID of the currently active section
 */
export const useScrollSpy = (
  sectionIds: string[],
  offset: number = 150,
): string => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll(); // Call once on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};

export default useScrollSpy;
