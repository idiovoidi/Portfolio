import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { type ThreeDWork, threeDWorks } from "../../data/threeD";
import { useInView } from "../../hooks";
import {
  createFadeInUp,
  fadeIn,
  revealState,
  scaleIn,
} from "../../utils/animations";
import { DimensionBackground } from "../ui/DimensionBackground";
import { ModelViewer } from "../ui/ModelViewer";
import { Section } from "../ui/Section";
import { TextEffect } from "../ui/TextEffect";

const CycleImages = ({
  title,
  images,
}: {
  title: string;
  images: string[];
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % images.length),
      3000,
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative h-full w-full">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} ${i + 1}`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export const ThreeD = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const settings = usePerformanceSettings();
  const [selectedModel, setSelectedModel] = useState<ThreeDWork | null>(null);

  return (
    <Section
      id="three-d"
      className="overflow-hidden"
      background={<DimensionBackground />}
      title={
        <TextEffect effect="glitch" as="h2" className="section-heading">
          3Ð W0RKS
        </TextEffect>
      }
      subtitle={
        <p className="section-subheading max-w-2xl mx-auto">
          <TextEffect
            effect="flicker"
            className="font-bold"
            style={{ color: "#00D9FF" }}
          >
            Dimensional creations from the void
          </TextEffect>
        </p>
      }
    >
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      >
        {threeDWorks.map((work, index) => (
          <motion.div
            key={work.id}
            variants={createFadeInUp(index * 0.1)}
            initial="initial"
            animate={revealState(inView, settings.enableAnimations)}
            className="relative group cursor-pointer"
            onClick={() => setSelectedModel(work)}
          >
            <div className="relative overflow-hidden rounded-lg bg-black/40 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 h-full">
              <div className="relative aspect-square overflow-hidden bg-black/50">
                {work.images && work.imageLayout === "cycle" && (
                  <CycleImages title={work.title} images={work.images} />
                )}
                {work.images && work.imageLayout !== "cycle" && (
                  <div
                    className="grid h-full w-full"
                    style={{
                      gridTemplateColumns: `repeat(${work.images.length}, 1fr)`,
                    }}
                  >
                    {work.images.map((src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt={`${work.title} ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ))}
                  </div>
                )}
                {inView && work.modelPath && (
                  <ModelViewer
                    src={work.modelPath}
                    alt={work.title}
                    poster={work.thumbnail}
                    textures={work.textures}
                    autoRotate={true}
                    cameraControls={false}
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-1">
                  {work.title}
                </h3>
                {work.category && (
                  <span
                    className={
                      work.category === "Zbrush"
                        ? "inline-block rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white bg-[#F26A1B] border border-[#FF9650]/60 shadow-[0_0_8px_rgba(242,106,27,0.5)]"
                        : "text-xs text-gray-500 uppercase tracking-wider"
                    }
                  >
                    {work.category}
                  </span>
                )}
                {work.description && (
                  <p className="text-sm text-gray-400 mt-2">
                    {work.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedModel && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedModel(null)}
        >
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            className="relative w-full max-w-6xl h-[80vh] bg-black/60 rounded-lg border border-cyan-500/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedModel(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/60 rounded-full border border-cyan-500/30 text-cyan-400"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="absolute top-4 left-4 z-10 bg-black/60 px-4 py-3 rounded-lg border border-cyan-500/30">
              <h3 className="text-xl font-bold text-cyan-400 mb-1">
                {selectedModel.title}
              </h3>
              {selectedModel.description && (
                <p className="text-sm text-gray-400">
                  {selectedModel.description}
                </p>
              )}
            </div>
            {selectedModel.images && (
              <div className="flex h-full w-full items-center justify-center gap-2 p-4 pt-24">
                {selectedModel.images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${selectedModel.title} ${i + 1}`}
                    className="h-full min-w-0 flex-1 object-contain"
                  />
                ))}
              </div>
            )}
            {selectedModel.modelPath && (
              <ModelViewer
                src={selectedModel.modelPath}
                alt={selectedModel.title}
                textures={selectedModel.textures}
                autoRotate={true}
                cameraControls={true}
                className="w-full h-full"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </Section>
  );
};
