import { motion } from "framer-motion";
import type React from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { useInView } from "../../hooks";
import {
  fadeInUp,
  revealState,
  staggerContainer,
} from "../../utils/animations";
import { NeuralBackground } from "../ui/NeuralBackground";
import { Section } from "../ui/Section";
import { SkillExplorer } from "../ui/SkillExplorer";

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
          <SkillExplorer />
        </motion.div>
      </motion.div>
    </Section>
  );
};
