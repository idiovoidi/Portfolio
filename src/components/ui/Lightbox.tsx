import type React from "react";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  /** Short caption shown under the title */
  description?: string;
  embedUrl?: string;
  nftUrl?: string;
  /** When set, plays an HTML5 video instead of showing the image */
  videoSrc?: string;
  /** When set, shows these images stacked in a scrollable column */
  images?: { src: string; caption?: string }[];
  /** When set, shows a YouTube embed (works for Shorts, portrait) */
  youtubeId?: string;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt = "Lightbox image",
  title,
  description,
  embedUrl,
  nftUrl,
  videoSrc,
  youtubeId,
  images,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      window.addEventListener("portfolio:navigate", onClose);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
        window.removeEventListener("portfolio:navigate", onClose);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={videoSrc ? "Video lightbox" : "Image lightbox"}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
        aria-label="Close lightbox"
      >
        <IoClose size={32} />
      </button>

      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
        {title && (
          <h3
            className={`text-white text-xl font-semibold text-center ${
              description ? "mb-1" : "mb-4"
            }`}
          >
            {title}
          </h3>
        )}
        {description && (
          <p className="mb-4 max-w-2xl text-center text-sm text-gray-300">
            {description}
          </p>
        )}

        {embedUrl ? (
          <div
            className="w-full max-w-4xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedUrl}
              className="w-full aspect-square max-h-[70vh] rounded-lg shadow-2xl border-2 border-accent-primary/30"
              title={title || "NFT Artwork"}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
            {nftUrl && (
              <a
                href={nftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 px-6 py-3 bg-accent-primary/20 hover:bg-accent-primary/30 border border-accent-primary rounded-lg text-accent-primary hover:text-white transition-all duration-300 font-medium"
              >
                View on objkt.com →
              </a>
            )}
          </div>
        ) : youtubeId ? (
          <iframe
            key={youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={title || "YouTube video"}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full max-h-[80vh] aspect-[9/16] max-w-full rounded-lg shadow-2xl border-0 bg-black"
          />
        ) : videoSrc ? (
          <video
            key={videoSrc}
            src={videoSrc}
            poster={imageSrc}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-[80vh] w-full rounded-lg shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            Your browser does not support the video tag.
          </video>
        ) : images && images.length > 0 ? (
          <div
            className="flex max-h-[80vh] w-full max-w-5xl flex-col gap-4 overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {images.map(({ src, caption }, i) => (
              <figure key={src} className="m-0">
                {caption && (
                  <figcaption className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-100">
                    {caption}
                  </figcaption>
                )}
                <img
                  src={src}
                  alt={caption ?? `${imageAlt} ${i + 1}`}
                  className="block h-auto w-full rounded-lg shadow-2xl"
                />
              </figure>
            ))}
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
};

export default Lightbox;
