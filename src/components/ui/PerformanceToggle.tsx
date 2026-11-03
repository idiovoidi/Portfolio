import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { FiSettings, FiX } from "react-icons/fi";
import { usePerformance } from "../../contexts/PerformanceContext";

/**
 * PerformanceToggle - Floating settings button to control performance features
 * Allows users to toggle tilt effects, particles, and animations
 */
export const PerformanceToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggleTiltEffect, toggleParticles, toggleAnimations } =
    usePerformance();

  return (
    <>
      {/* Floating Settings Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Performance Settings"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FiX size={24} /> : <FiSettings size={24} />}
        </motion.div>
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 z-50 bg-surface rounded-lg shadow-2xl p-6 w-80"
              style={{
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 className="text-lg font-bold mb-4 text-text-primary">
                Performance Settings
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Toggle effects to optimize performance on your device
              </p>

              <div className="space-y-4">
                {/* 3D Tilt Effect Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="tilt-toggle"
                      className="text-sm font-medium text-text-primary"
                    >
                      3D Card Tilt
                    </label>
                    <p className="text-xs text-text-secondary">
                      Interactive tilt effect on project cards
                    </p>
                  </div>
                  <button
                    id="tilt-toggle"
                    onClick={toggleTiltEffect}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      settings.enableTiltEffect ? "bg-primary" : "bg-gray-600"
                    }`}
                    role="switch"
                    aria-checked={settings.enableTiltEffect}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        settings.enableTiltEffect
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Particle Background Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="particles-toggle"
                      className="text-sm font-medium text-text-primary"
                    >
                      Particle Background
                    </label>
                    <p className="text-xs text-text-secondary">
                      Animated cosmic background effect
                    </p>
                  </div>
                  <button
                    id="particles-toggle"
                    onClick={toggleParticles}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      settings.enableParticles ? "bg-primary" : "bg-gray-600"
                    }`}
                    role="switch"
                    aria-checked={settings.enableParticles}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        settings.enableParticles
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Animations Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="animations-toggle"
                      className="text-sm font-medium text-text-primary"
                    >
                      Scroll Animations
                    </label>
                    <p className="text-xs text-text-secondary">
                      Fade-in effects when scrolling
                    </p>
                  </div>
                  <button
                    id="animations-toggle"
                    onClick={toggleAnimations}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      settings.enableAnimations ? "bg-primary" : "bg-gray-600"
                    }`}
                    role="switch"
                    aria-checked={settings.enableAnimations}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        settings.enableAnimations
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-text-secondary">
                  Settings are automatically saved and will persist across
                  sessions.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
