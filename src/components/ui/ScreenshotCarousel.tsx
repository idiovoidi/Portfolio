import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import type { ProjectScreenshot } from "../../data/projects";

export interface ScreenshotCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  screenshots: ProjectScreenshot[];
  projectTitle: string;
  initialIndex?: number;
}

const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  isOpen,
  onClose,
  screenshots,
  projectTitle,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);

  const goToPrevious = () => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  const currentScreenshot = screenshots[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-90"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl mx-4 bg-surface rounded-lg shadow-2xl overflow-hidden"
            style={{ maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  {projectTitle}
                </h3>
                <p className="text-sm text-text-secondary">
                  Screenshot {currentIndex + 1} of {screenshots.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-background transition-colors"
                aria-label="Close carousel"
              >
                <FiX size={24} className="text-text-primary" />
              </button>
            </div>

            {/* Image Container */}
            <div
              className="relative bg-background flex items-center justify-center"
              style={{ height: "60vh", minHeight: "400px" }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <img
                src={currentScreenshot.image}
                alt={currentScreenshot.caption}
                onLoad={() => setImageLoaded(true)}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Navigation Buttons */}
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all"
                    aria-label="Previous screenshot"
                  >
                    <FiChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all"
                    aria-label="Next screenshot"
                  >
                    <FiChevronRight size={24} className="text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            <div className="p-4 border-t border-border">
              <p className="text-text-primary text-center">
                {currentScreenshot.caption}
              </p>
            </div>

            {/* Thumbnail Navigation */}
            {screenshots.length > 1 && (
              <div className="p-4 border-t border-border overflow-x-auto">
                <div className="flex gap-2 justify-center">
                  {screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setImageLoaded(false);
                        setCurrentIndex(index);
                      }}
                      className={`shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? "border-primary scale-110"
                          : "border-border hover:border-primary-light opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View screenshot ${index + 1}`}
                    >
                      <img
                        src={screenshot.image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard Hints */}
            <div className="px-4 pb-4 text-center text-xs text-text-secondary">
              Use arrow keys to navigate • Press ESC to close
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScreenshotCarousel;
