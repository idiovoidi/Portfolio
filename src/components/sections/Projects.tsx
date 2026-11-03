import { motion } from "framer-motion";
import type React from "react";
import { useMemo, useState } from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { projects } from "../../data/projects";
import { useInView } from "../../hooks";
import { createFadeInUp, fadeIn, revealState } from "../../utils/animations";
import ProjectCard from "../ui/ProjectCard";
import { Section } from "../ui/Section";

type CategoryFilter = "all" | "development" | "game";

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "development", label: "Development" },
  { value: "game", label: "Games" },
];

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const { ref: filtersRef, inView: filtersInView } = useInView({
    threshold: 0.2,
  });
  const settings = usePerformanceSettings();

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projects;
    }
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <Section
      id="projects"
      tone="surface"
      title="Projects"
      subtitle="A collection of my work spanning web development, interactive games, and creative design"
    >
      {/* Category Filter Tabs */}
      <motion.div
        ref={filtersRef}
        variants={createFadeInUp(0.2)}
        initial="initial"
        animate={revealState(filtersInView, settings.enableAnimations)}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 
                ${
                  activeCategory === category.value
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-background text-text-secondary hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                }`}
            aria-label={`Filter by ${category.label}`}
            aria-pressed={activeCategory === category.value}
          >
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              disableTilt={!settings.enableTiltEffect}
            />
          ))
        ) : (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="col-span-full text-center py-12"
          >
            <p className="text-text-secondary text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </Section>
  );
};
