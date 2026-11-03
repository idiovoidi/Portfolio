import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import type { ArtPiece } from "../../data/artworks";

export interface ArtPieceCardProps {
  artwork: ArtPiece;
  index: number;
  onClick: () => void;
}

const ArtPieceCard: React.FC<ArtPieceCardProps> = ({
  artwork,
  index,
  onClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${artwork.title} in full size`}
    >
      {/* Void frame with organic texture */}
      <div className="relative p-[3px] bg-gradient-to-br from-stone-800/40 via-purple-900/30 to-stone-900/40 rounded">
        {/* Subtle corner markers - organic style */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-stone-500/50 group-hover:border-purple-400/60 transition-colors duration-500" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-stone-500/50 group-hover:border-purple-400/60 transition-colors duration-500" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-stone-500/50 group-hover:border-purple-400/60 transition-colors duration-500" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-stone-500/50 group-hover:border-purple-400/60 transition-colors duration-500" />

        {/* Soft ambient glow */}
        <motion.div
          className="absolute inset-0 rounded opacity-0 group-hover:opacity-100"
          animate={
            isHovered
              ? {
                  boxShadow: [
                    "0 0 15px rgba(88, 28, 135, 0.3)",
                    "0 0 25px rgba(88, 28, 135, 0.4)",
                    "0 0 15px rgba(88, 28, 135, 0.3)",
                  ],
                }
              : {}
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner void */}
        <div className="relative bg-black/90 backdrop-blur-sm rounded overflow-hidden shadow-2xl">
          {/* Subtle dust particles on hover */}
          {isHovered && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px h-px bg-purple-300/40 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + i * 20}%`,
                  }}
                  animate={{
                    y: [0, -30, -60],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}

          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-8 h-8 border-4 border-purple-800 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={artwork.image}
              alt={artwork.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Void overlay - deep space feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Info panel - earthy void style */}
            <motion.div
              initial={{ y: "100%" }}
              animate={isHovered ? { y: 0 } : { y: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-stone-950/98 to-transparent p-4 border-t border-stone-700/30"
            >
              {/* Title with soft glow */}
              <h3 className="text-stone-100 font-bold text-lg mb-1 drop-shadow-[0_2px_8px_rgba(88,28,135,0.4)]">
                {artwork.title}
              </h3>

              {/* Medium */}
              <p className="text-stone-400 text-sm mb-2">{artwork.medium}</p>

              {/* Tools badges - organic style */}
              <div className="flex flex-wrap gap-1">
                {artwork.tools.slice(0, 3).map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2 py-1 bg-stone-800/60 border border-stone-700/50 rounded text-stone-300"
                  >
                    {tool}
                  </span>
                ))}
                {artwork.tools.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-purple-950/60 border border-purple-900/50 rounded text-purple-300">
                    +{artwork.tools.length - 3}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Subtle presence indicator */}
            <div className="absolute top-2 right-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtPieceCard;
