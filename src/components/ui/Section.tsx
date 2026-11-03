import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { useInView } from "../../hooks";
import { fadeInUp, revealState } from "../../utils/animations";

export type SectionTone = "background" | "surface" | "secondary" | "light";

const toneColor: Record<SectionTone, string> = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  secondary: "var(--color-background-secondary)",
  light: "transparent",
};

export interface SectionProps {
  id: string;
  tone?: SectionTone;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  sectionStyle?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  headerClassName?: string;
  background?: ReactNode;
  children: ReactNode;
}

export const Section = ({
  id,
  tone = "background",
  title,
  subtitle,
  className = "",
  sectionStyle,
  containerClassName = "",
  containerStyle,
  headerClassName = "text-center mb-12",
  background,
  children,
}: SectionProps) => {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const settings = usePerformanceSettings();
  const animate = revealState(inView, settings.enableAnimations);

  return (
    <section
      id={id}
      className={`section relative ${className}`.trim()}
      style={{ backgroundColor: toneColor[tone], ...sectionStyle }}
    >
      {background}
      <div
        className={`container-custom relative z-10 ${containerClassName}`.trim()}
        style={containerStyle}
      >
        {(title || subtitle) && (
          <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="initial"
            animate={animate}
            className={headerClassName}
          >
            {typeof title === "string" ? (
              <h2 className="section-heading">{title}</h2>
            ) : (
              title
            )}
            {typeof subtitle === "string" ? (
              <p className="section-subheading max-w-2xl mx-auto">{subtitle}</p>
            ) : (
              subtitle
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};
