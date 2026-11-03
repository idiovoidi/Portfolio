import type React from "react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface PerformanceSettings {
  enableTiltEffect: boolean;
  enableParticles: boolean;
  enableAnimations: boolean;
}

interface PerformanceContextType {
  settings: PerformanceSettings;
  toggleTiltEffect: () => void;
  toggleParticles: () => void;
  toggleAnimations: () => void;
  detectPerformanceIssues: () => boolean;
}

const defaultSettings: PerformanceSettings = {
  enableTiltEffect: true,
  enableParticles: true,
  enableAnimations: true,
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined,
);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within PerformanceProvider");
  }
  return context;
};

export const usePerformanceSettings = (): PerformanceSettings => {
  const context = useContext(PerformanceContext);
  return context?.settings ?? defaultSettings;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<PerformanceSettings>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("performanceSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("performanceSettings", JSON.stringify(settings));
  }, [settings]);

  // Detect performance issues
  const detectPerformanceIssues = (): boolean => {
    // Check if device is mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Check hardware concurrency (CPU cores)
    const lowEndDevice = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency < 4
      : false;

    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    const lowMemory = deviceMemory ? deviceMemory < 4 : false;

    return isMobile || prefersReducedMotion || lowEndDevice || lowMemory;
  };

  // Auto-disable effects on low-end devices
  useEffect(() => {
    const hasPerformanceIssues = detectPerformanceIssues();
    if (hasPerformanceIssues) {
      const saved = localStorage.getItem("performanceSettings");
      // Only auto-disable if user hasn't manually set preferences
      if (!saved) {
        setSettings({
          enableTiltEffect: false,
          enableParticles: false,
          enableAnimations: true, // Keep basic animations
        });
      }
    }
  }, []);

  const toggleTiltEffect = () => {
    setSettings((prev) => ({
      ...prev,
      enableTiltEffect: !prev.enableTiltEffect,
    }));
  };

  const toggleParticles = () => {
    setSettings((prev) => ({
      ...prev,
      enableParticles: !prev.enableParticles,
    }));
  };

  const toggleAnimations = () => {
    setSettings((prev) => ({
      ...prev,
      enableAnimations: !prev.enableAnimations,
    }));
  };

  return (
    <PerformanceContext.Provider
      value={{
        settings,
        toggleTiltEffect,
        toggleParticles,
        toggleAnimations,
        detectPerformanceIssues,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};
