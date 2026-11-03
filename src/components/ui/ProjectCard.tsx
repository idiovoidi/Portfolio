import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { FaExternalLinkAlt, FaGamepad, FaGithub } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import type { Project } from "../../data/projects";
import { useTilt } from "../../hooks/useTilt";
import Button from "./Button";
import EmbeddedDemo from "./EmbeddedDemo";
import ScreenshotCarousel from "./ScreenshotCarousel";
import SkillBadge from "./SkillBadge";

export interface ProjectCardProps {
  project: Project;
  index: number;
  disableTilt?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  disableTilt = false,
}) => {
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 3D Tilt effect
  const {
    ref: tiltRef,
    tiltStyle,
    glareStyle,
  } = useTilt({
    maxTilt: 10,
    perspective: 1000,
    scale: 1.02,
    speed: 400,
    glare: true,
    maxGlare: 0.2,
    disabled: disableTilt,
  });

  const handlePlayDemo = () => {
    if (project.embedUrl) {
      setIsEmbedOpen(true);
    }
  };

  return (
    <>
      <div
        ref={tiltRef}
        style={{
          ...tiltStyle,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Glare Effect Overlay */}
          {glareStyle && <div style={glareStyle} />}
          {/* Image Container */}
          <div className="relative w-full aspect-video overflow-hidden bg-background border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4"
            >
              <div className="flex gap-2 mb-2 flex-wrap justify-center">
                {project.screenshots && project.screenshots.length > 0 && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setIsCarouselOpen(true)}
                    aria-label={`View ${project.title} screenshots`}
                    className="flex items-center gap-2"
                  >
                    <FiImage size={16} />
                    <span>Screenshots ({project.screenshots.length})</span>
                  </Button>
                )}
                {project.embedUrl && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handlePlayDemo}
                    aria-label={`Play ${project.title} demo`}
                    className="flex items-center gap-2"
                  >
                    <FaGamepad size={16} />
                    <span>Play Demo</span>
                  </Button>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="secondary"
                      size="small"
                      aria-label={`${
                        project.category === "game" ? "Play" : "View"
                      } ${project.title} demo`}
                      className="flex items-center gap-2"
                    >
                      {project.category === "game" ? (
                        <FaGamepad size={16} />
                      ) : (
                        <FaExternalLinkAlt size={14} />
                      )}
                      <span>
                        {project.category === "game"
                          ? "Play Demo"
                          : "View Demo"}
                      </span>
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="small"
                      aria-label={`View ${project.title} source code`}
                      className="flex items-center gap-2 bg-black bg-opacity-50 hover:bg-opacity-70"
                    >
                      <FaGithub size={16} />
                      <span>Code</span>
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full shadow-lg">
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>

            <p className="text-text-secondary text-sm mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Technology Badges */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <SkillBadge key={tech} name={tech} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Screenshot Carousel Modal */}
      {project.screenshots && project.screenshots.length > 0 && (
        <ScreenshotCarousel
          isOpen={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
          screenshots={project.screenshots}
          projectTitle={project.title}
        />
      )}

      {/* Embedded Demo Modal */}
      {project.embedUrl && (
        <EmbeddedDemo
          isOpen={isEmbedOpen}
          onClose={() => setIsEmbedOpen(false)}
          embedUrl={project.embedUrl}
          title={project.title}
          aspectRatio="16:9"
        />
      )}
    </>
  );
};

export default ProjectCard;
