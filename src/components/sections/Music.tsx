import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { spotifyArtistUrl, spotifyTracks } from "../../data/music";
import { useInView } from "../../hooks";
import { createFadeInUp, revealState } from "../../utils/animations";
import { Section } from "../ui/Section";
import { TextEffect } from "../ui/TextEffect";

const EQ_BAR_COUNT = 56;
const WAVE_PERIOD = 600;
const WAVE_WIDTH = WAVE_PERIOD * 4;

// Pseudo-random but stable, so bars don't reshuffle on re-render
const eqBars = Array.from({ length: EQ_BAR_COUNT }, (_, i) => {
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const envelope = 0.45 + 0.55 * Math.sin((i / (EQ_BAR_COUNT - 1)) * Math.PI);
  return {
    height: 40 + 60 * r * envelope,
    duration: 0.9 + r * 1.4,
    delay: -r * 3,
  };
});

const buildWave = (amplitude: number, cycles: number, phase: number) => {
  const mid = 100;
  const step = 20;
  let d = "";
  for (let x = 0; x <= WAVE_WIDTH; x += step) {
    const y =
      mid +
      amplitude * Math.sin((x / WAVE_WIDTH) * cycles * Math.PI * 2 + phase);
    d += `${x === 0 ? "M" : "L"}${x},${y.toFixed(1)} `;
  }
  return d;
};

// cycles must be even so a 50% shift loops seamlessly
const waves = [
  {
    d: buildWave(38, 8, 0),
    color: "168, 85, 247",
    duration: 22,
    opacity: 0.22,
  },
  {
    d: buildWave(24, 12, 1.3),
    color: "236, 72, 153",
    duration: 15,
    opacity: 0.16,
  },
  {
    d: buildWave(16, 16, 2.6),
    color: "59, 130, 246",
    duration: 30,
    opacity: 0.14,
  },
];

interface SpotifyController {
  addListener: (
    event: "playback_update",
    cb: (e: { data: { isPaused: boolean; isBuffering: boolean } }) => void,
  ) => void;
  destroy: () => void;
}

interface SpotifyIFrameAPI {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: string; height: number },
    cb: (controller: SpotifyController) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

const API_TIMEOUT_MS = 6000;

let spotifyApi: Promise<SpotifyIFrameAPI> | null = null;

// Official embed API: lets us hear play/pause without touching the iframe
const loadSpotifyApi = () => {
  spotifyApi ??= new Promise((resolve, reject) => {
    // The loader pulls in a second script; if that's blocked it never reports ready
    const timeout = window.setTimeout(() => {
      spotifyApi = null;
      reject(new Error("Spotify iframe API timed out"));
    }, API_TIMEOUT_MS);
    window.onSpotifyIframeApiReady = (api) => {
      window.clearTimeout(timeout);
      resolve(api);
    };
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => {
      spotifyApi = null;
      reject(new Error("Spotify iframe API failed to load"));
    };
    document.body.appendChild(script);
  });
  return spotifyApi;
};

const SpotifyEmbed = ({
  track,
  title,
  onPlayingChange,
}: {
  track: string;
  title: string;
  onPlayingChange: (playing: boolean) => void;
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const onChangeRef = useRef(onPlayingChange);
  onChangeRef.current = onPlayingChange;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let controller: SpotifyController | undefined;
    const mount = document.createElement("div");
    host.appendChild(mount);

    loadSpotifyApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(
          mount,
          {
            uri: `spotify:track:${track}`,
            width: "100%",
            height: 152,
          },
          (c) => {
            if (cancelled) return c.destroy();
            controller = c;
            c.addListener("playback_update", (e) =>
              onChangeRef.current(!e.data.isPaused && !e.data.isBuffering),
            );
          },
        );
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      controller?.destroy();
      onChangeRef.current(false);
      mount.remove();
    };
  }, [track]);

  if (failed) {
    return (
      <iframe
        src={`https://open.spotify.com/embed/track/${track}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
        title={title}
      />
    );
  }

  return <div ref={hostRef} className="rounded-lg" />;
};

const MusicBackground = ({
  animated,
  playing,
}: {
  animated: boolean;
  playing: boolean;
}) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Ambient glows */}
    <div
      className="absolute -top-20 left-[10%] w-[28rem] h-[28rem] rounded-full opacity-20"
      style={{
        background:
          "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, transparent 70%)",
        animation: animated ? "musicPulse 4s ease-in-out infinite" : undefined,
      }}
    />
    <div
      className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full opacity-15"
      style={{
        background:
          "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)",
        animation: animated
          ? "musicPulse 5s ease-in-out infinite 0.8s"
          : undefined,
      }}
    />

    {/* Sub-bass rings radiating from the centre */}
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute left-1/2 top-1/2 rounded-full border border-purple-400/40"
        style={{
          width: "90vmax",
          height: "90vmax",
          opacity: animated ? 0 : 0.06 + i * 0.03,
          transform: `translate(-50%, -50%) scale(${0.35 + i * 0.25})`,
          animation: animated
            ? `bassRing 9s cubic-bezier(0.2, 0.6, 0.3, 1) infinite ${i * 3}s`
            : undefined,
        }}
      />
    ))}

    {/* Scrolling waveforms */}
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-48"
      style={{ opacity: "calc(0.7 + var(--beat) * 0.5)" }}
    >
      {waves.map((wave) => (
        <svg
          key={wave.color}
          className="absolute top-0 left-0 h-full"
          style={{
            width: "200%",
            opacity: wave.opacity,
            animation: animated
              ? `waveScroll ${wave.duration}s linear infinite`
              : undefined,
          }}
          viewBox={`0 0 ${WAVE_WIDTH} 200`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={wave.d}
            fill="none"
            stroke={`rgb(${wave.color})`}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ))}
    </div>

    {/* Equalizer bars */}
    <div
      className="absolute inset-x-0 bottom-0 h-56 flex items-end justify-between gap-1 px-2"
      style={{
        transformOrigin: "bottom",
        transform: `scaleY(${playing ? 1 : 0.12})`,
        transition: "transform 1s ease-out",
        maskImage: "linear-gradient(to top, black 10%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 100%)",
      }}
    >
      {eqBars.map((bar, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-purple-500/40 via-pink-500/25 to-transparent"
          style={{
            height: `${bar.height}%`,
            transformOrigin: "bottom",
            transform: animated ? undefined : "scaleY(0.4)",
            animation: animated
              ? `eqBar ${bar.duration * (playing ? 1 : 3)}s ease-in-out infinite ${bar.delay}s`
              : undefined,
          }}
        />
      ))}
    </div>
  </div>
);

export const Music = () => {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });
  const settings = usePerformanceSettings();
  const showEmbeds = inView;
  const [playingIds, setPlayingIds] = useState<ReadonlySet<string>>(new Set());
  const playing = playingIds.size > 0;
  const setTrackPlaying = (id: string, isPlaying: boolean) =>
    setPlayingIds((prev) => {
      if (prev.has(id) === isPlaying) return prev;
      const next = new Set(prev);
      if (isPlaying) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <Section
      id="music"
      tone="secondary"
      className="overflow-hidden"
      background={
        <MusicBackground
          animated={settings.enableAnimations}
          playing={playing}
        />
      }
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
                <SpotifyEmbed
                  track={track.id}
                  title={track.title || `Spotify track ${index + 1}`}
                  onPlayingChange={(p) => setTrackPlaying(track.id, p)}
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
