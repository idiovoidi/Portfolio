import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { videos, youtubeChannelUrl } from "../../data/videos";
import { useInView } from "../../hooks";
import { createFadeInUp, revealState } from "../../utils/animations";
import { CRTEffect } from "../ui/CRTEffect";
import { Section } from "../ui/Section";
import { TextEffect } from "../ui/TextEffect";

export const Videos = () => {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });
  const settings = usePerformanceSettings();

  return (
    <Section
      id="videos"
      className="overflow-hidden"
      background={<CRTEffect />}
      title={
        <TextEffect effect="glitch" as="h2" className="section-heading">
          VIÐɆ0
        </TextEffect>
      }
      subtitle={
        <p className="section-subheading max-w-2xl mx-auto">
          <TextEffect
            effect="flicker"
            className="font-bold"
            style={{ color: "#FF0000" }}
          >
            Transmissions from the void
          </TextEffect>
        </p>
      }
    >
      <div ref={ref} className="grid grid-cols-1 gap-8 max-w-4xl mx-auto mb-12">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            variants={createFadeInUp(index * 0.1)}
            initial="initial"
            animate={revealState(inView, settings.enableAnimations)}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20 hover:border-red-500/50 transition-all duration-300">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                {inView ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={video.title || `YouTube video ${index + 1}`}
                  />
                ) : null}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <a
          href={youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
        >
          <FaYoutube className="text-xl" />
          <span className="font-medium">View All Videos</span>
        </a>
      </div>
    </Section>
  );
};
