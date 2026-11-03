import { motion } from "framer-motion";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { spotifyArtistUrl, spotifyTracks } from "../../data/music";
import { useInView } from "../../hooks";
import { createFadeInUp, revealState } from "../../utils/animations";
import { Section } from "../ui/Section";
import { TextEffect } from "../ui/TextEffect";

const MusicBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
      style={{
        background:
          "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
        animation: "musicPulse 2s ease-in-out infinite",
      }}
    />
    <div
      className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-15"
      style={{
        background:
          "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
        animation: "musicPulse 2.5s ease-in-out infinite 0.3s",
      }}
    />
    <div
      className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full opacity-10"
      style={{
        background:
          "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
        animation: "musicPulse 3s ease-in-out infinite 0.6s",
      }}
    />
    <div className="absolute left-0 top-1/2 w-full h-1 opacity-10">
      <div
        className="h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        style={{ animation: "soundwave 4s ease-in-out infinite" }}
      />
    </div>
  </div>
);

export const Music = () => {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });
  const settings = usePerformanceSettings();
  const showEmbeds = inView;

  return (
    <Section
      id="music"
      tone="secondary"
      className="overflow-hidden"
      background={<MusicBackground />}
      title={
        <TextEffect effect="glitch" as="h2" className="section-heading">
          MUSIC
        </TextEffect>
      }
      subtitle={
        <p className="section-subheading max-w-2xl mx-auto">
          Sounds from the{" "}
          <TextEffect
            effect="flicker"
            className="font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            VOID
          </TextEffect>
        </p>
      }
    >
      <div ref={ref} className="grid grid-cols-1 gap-6 max-w-4xl mx-auto mb-12">
        {spotifyTracks.map((track, index) => (
          <motion.div
            key={track.id}
            variants={createFadeInUp(index * 0.1)}
            initial="initial"
            animate={revealState(inView, settings.enableAnimations)}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
              {showEmbeds ? (
                <iframe
                  src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title={track.title || `Spotify track ${index + 1}`}
                />
              ) : (
                <div className="h-[152px]" aria-hidden />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <a
          href={spotifyArtistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
        >
          View All Music on Spotify
        </a>
      </div>
    </Section>
  );
};
