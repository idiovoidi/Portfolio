import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

export interface EmbeddedDemoProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
}

const EmbeddedDemo: React.FC<EmbeddedDemoProps> = ({
  isOpen,
  onClose,
  embedUrl,
  title,
  aspectRatio = "16:9",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const aspectRatioMap = {
    "16:9": "pb-[56.25%]",
    "4:3": "pb-[75%]",
    "1:1": "pb-[100%]",
  };

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Handle ESC key press
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (isFullscreen) {
            exitFullscreen();
          } else {
            onClose();
          }
        }
      };

      // Handle fullscreen change
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
      };
    }
  }, [isOpen, onClose, isFullscreen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Exit fullscreen error:", error);
      }
    }
  };

  const handleClose = async () => {
    await exitFullscreen();
    setIsLoading(true);
    setHasError(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Embedded demo viewer"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl bg-surface rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
          {title && (
            <h3 className="text-lg font-semibold text-text-primary truncate">
              {title}
            </h3>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-text-secondary hover:text-primary transition-colors duration-200 rounded hover:bg-surface"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <MdFullscreenExit size={24} />
              ) : (
                <MdFullscreen size={24} />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-2 text-text-secondary hover:text-error transition-colors duration-200 rounded hover:bg-surface"
              aria-label="Close demo"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        {/* Iframe container */}
        <div
          className={`relative w-full ${aspectRatioMap[aspectRatio]} bg-black`}
        >
          {/* Loading indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">Loading demo...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-error text-lg font-semibold mb-2">
                  Failed to load demo
                </p>
                <p className="text-text-secondary text-sm mb-4">
                  The embedded content could not be loaded. Please try again
                  later.
                </p>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            title={title || "Embedded demo"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      </div>
    </div>
  );
};

export default EmbeddedDemo;
