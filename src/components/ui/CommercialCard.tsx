import { motion } from "framer-motion";
import { useState } from "react";
import type { CommercialWork } from "../../data/commercial";
import { commercialTagLabel } from "../../data/commercialTags";

export interface CommercialCardProps {
  work: CommercialWork;
  index: number;
  onClick: () => void;
}

/** Slight organic offsets so the grid doesn't read as a rigid card wall. */
const floatOffset = (index: number) => {
  const rotations = [-1.4, 0.8, -0.6, 1.2, -1, 0.5, 1.5, -0.9];
  const lifts = [0, 10, -6, 14, -4, 8, -10, 4];
  return {
    rotate: rotations[index % rotations.length],
    y: lifts[index % lifts.length],
  };
};

const CommercialCard = ({ work, index, onClick }: CommercialCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const offset = floatOffset(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 + offset.y, rotate: offset.rotate }}
      whileInView={{ opacity: 1, y: offset.y, rotate: offset.rotate }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{
        y: offset.y - 10,
        rotate: 0,
        scale: 1.03,
        transition: { duration: 0.35 },
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full cursor-pointer break-inside-avoid"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={
        work.videoSrc || work.youtubeId
          ? `Play ${work.title}` : `View ${work.title} in full size`
      }
      style={{
        filter: isHovered
          ? "drop-shadow(0 22px 36px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 24px rgba(253, 230, 138, 0.22))"
          : "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.4))",
      }}
    >
      <div className="relative w-full overflow-hidden bg-transparent">
        {!imageLoaded && (
          <div
            className="flex w-full items-center justify-center rounded-sm bg-black/25"
            style={{ aspectRatio: "3 / 4", minHeight: "12rem" }}
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200/40 border-t-amber-400" />
          </div>
        )}
        <div
          className={`flex flex-col transition-opacity duration-500 ${
            work.stack ? "gap-2" : ""
          } ${imageLoaded ? "opacity-100" : "absolute inset-0 opacity-0"}`}
        >
          {(work.stack ?? [{ image: work.image, caption: undefined }]).map(
            (item, i) => (
              <div key={item.image} className="relative">
                <img
                  src={item.image}
                  alt={work.stack ? `${work.title} ${i + 1}` : work.title}
                  loading="lazy"
                  decoding="async"
                  onLoad={i === 0 ? () => setImageLoaded(true) : undefined}
                  className={`block h-auto w-full ${
                    work.stack ? "rounded-[2px] shadow-md" : ""
                  }`}
                />
                {item.caption && imageLoaded && (
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-100">
                    {item.caption}
                  </span>
                )}
              </div>
            ),
          )}
        </div>

        {work.tags[0] && imageLoaded && (
          <span
            className="absolute top-3 left-3 max-w-[85%] truncate rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-900/90"
            style={{
              background: "rgba(253, 230, 138, 0.85)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
            }}
          >
            {commercialTagLabel(work.tags[0])}
          </span>
        )}

        {(work.videoSrc || work.youtubeId) && imageLoaded && (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
              style={{
                background: "rgba(0, 0, 0, 0.55)",
                border: "1px solid rgba(253, 230, 138, 0.55)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="ml-0.5 h-6 w-6 fill-amber-100"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 pt-12"
        >
          <h3 className="mb-0.5 text-base font-semibold text-amber-50 drop-shadow-md">
            {work.title}
          </h3>
          <p className="text-sm text-amber-100/75">{work.medium}</p>
          {work.description && (
            <p className="mt-1 text-xs leading-snug text-amber-100/70">
              {work.description}
            </p>
          )}
          {work.client && (
            <p className="mt-1 text-xs uppercase tracking-wider text-amber-200/65">
              {work.client}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export { CommercialCard };
export default CommercialCard;
