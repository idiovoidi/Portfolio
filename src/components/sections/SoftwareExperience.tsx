import { motion } from "framer-motion";
import type React from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import {
  getActiveCategories,
  getSoftwareGroupedByLanguage,
  type SoftwareEntry,
} from "../../data/softwareData";
import { useInView } from "../../hooks";
import { fadeInUp, revealState } from "../../utils/animations";
import { Section } from "../ui/Section";
import { SoftwareCard } from "../ui/SoftwareCard";

/**
 * SoftwareExperience Section Component
 *
 * Displays software tools and technologies organized by category.
 * Libraries are visually grouped under their parent languages.
 * Implements scroll-triggered animations with staggered category groups.
 *
 * Layout:
 * - Responsive grid: 1 column (mobile <768px), 2 columns (tablet 768-1024px), 3 columns (desktop ≥1024px)
 * - Maximum content width: 1280px
 * - Categories rendered in order defined in categoryConfig
 * - Libraries indented under parent languages for visual hierarchy
 *
 * Styling:
 * - Dark void aesthetic with glowing purple accents
 * - Consistent with existing portfolio sections (Skills, Projects)
 * - Scroll-triggered animations using Framer Motion and useInView hook
 *
 * Future Enhancement:
 * - onClick handler can be added to enable filtering of portfolio pieces by software
 */
export const SoftwareExperience: React.FC = () => {
  const settings = usePerformanceSettings();

  // Get all active categories sorted by display order
  const categories = getActiveCategories();

  return (
    <Section
      id="software-experience"
      title="Software Experience"
      subtitle="Tools and technologies that power my creative journey across music, design, development, and more"
      headerClassName="text-center mb-16"
      containerStyle={{ maxWidth: "1280px", margin: "0 auto" }}
    >
      {/* Render each category */}
      {categories.map(({ category, title }, categoryIndex) => {
        const { standalone, grouped } = getSoftwareGroupedByLanguage(category);

        if (standalone.length === 0 && Object.keys(grouped).length === 0)
          return null;

        return (
          <CategorySection
            key={category}
            title={title}
            standalone={standalone}
            grouped={grouped}
            categoryIndex={categoryIndex}
            totalCategories={categories.length}
            categoryVariants={fadeInUp}
            animationsEnabled={settings.enableAnimations}
          />
        );
      })}
    </Section>
  );
};

// Separate component for each category section to manage individual inView state
interface CategorySectionProps {
  title: string;
  standalone: SoftwareEntry[];
  grouped: Record<string, SoftwareEntry[]>;
  categoryIndex: number;
  totalCategories: number;
  categoryVariants: typeof fadeInUp;
  animationsEnabled: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  standalone,
  grouped,
  categoryIndex,
  totalCategories,
  categoryVariants,
  animationsEnabled,
}) => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Interleave standalone items with their grouped libraries
  const renderSoftwareWithGroups = () => {
    const elements: React.ReactNode[] = [];
    let cardIndex = 0;

    standalone.forEach((software) => {
      // Render the main software/language
      elements.push(
        <SoftwareCard
          key={software.id}
          software={software}
          index={cardIndex++}
        />,
      );

      // Check if this software has grouped libraries
      const languageName = software.name;
      if (grouped[languageName] && grouped[languageName].length > 0) {
        // Render grouped libraries with visual indication
        grouped[languageName].forEach((library) => {
          elements.push(
            <div key={library.id} className="relative">
              {/* Subtle connector line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500/20"
                style={{ marginLeft: "-12px" }}
              />
              <SoftwareCard
                software={library}
                index={cardIndex++}
                isGrouped={true}
              />
            </div>,
          );
        });
      }
    });

    return elements;
  };

  return (
    <motion.div
      ref={ref}
      variants={categoryVariants}
      initial="initial"
      animate={revealState(inView, animationsEnabled)}
      data-category={title}
      className={categoryIndex < totalCategories - 1 ? "mb-16" : ""}
    >
      {/* Category Title */}
      <h3
        className="text-2xl font-semibold mb-6"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {title}
      </h3>

      {/* Software Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderSoftwareWithGroups()}
      </div>
    </motion.div>
  );
};
