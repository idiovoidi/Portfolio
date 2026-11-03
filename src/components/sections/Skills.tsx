import { motion } from "framer-motion";
import type React from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { skillsData } from "../../data/skills";
import { useInView } from "../../hooks";
import {
  fadeInUp,
  revealState,
  staggerContainer,
} from "../../utils/animations";
import { NeuralBackground } from "../ui/NeuralBackground";
import { Section } from "../ui/Section";
import SkillBadge from "../ui/SkillBadge";
import { SkillGraph } from "../ui/SkillGraph";

export const Skills: React.FC = () => {
  const { ref: skillsRef, inView: skillsInView } = useInView({
    threshold: 0.1,
  });
  const settings = usePerformanceSettings();

  return (
    <Section
      id="skills"
      title="Skills & Technologies"
      subtitle="Neural pathways of technical expertise - where knowledge connects and evolves"
      headerClassName="text-center mb-16"
      background={<NeuralBackground />}
    >
      {/* Skills Grid by Category */}
      <motion.div
        ref={skillsRef}
        variants={staggerContainer}
        initial="initial"
        animate={revealState(skillsInView, settings.enableAnimations)}
        className="space-y-12"
      >
        <motion.div variants={fadeInUp}>
          <SkillGraph />
        </motion.div>

        {skillsData.map((group) => (
          <motion.div
            key={group.name}
            variants={fadeInUp}
            className="skill-category"
          >
            {/* Category Title */}
            <h3
              className="text-2xl font-semibold mb-6"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {group.name}
            </h3>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.skills.map((skill, skillIndex) => (
                <SkillBadge
                  key={`${skill.name}-${skillIndex}`}
                  name={skill.name}
                  icon={skill.icon}
                  index={skillIndex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
