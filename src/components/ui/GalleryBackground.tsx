import type React from "react";

const GalleryBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* CSS-based noise/grain texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(88, 28, 135, 0.03) 2px,
              rgba(88, 28, 135, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(68, 64, 60, 0.03) 2px,
              rgba(68, 64, 60, 0.03) 4px
            )
          `,
          backgroundSize: "4px 4px",
          filter: "contrast(1.2) brightness(0.9)",
        }}
      />

      {/* Organic gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-stone-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/10 via-transparent to-stone-950/15" />

      {/* Static void clouds - no animation */}
      <div
        className="absolute left-[20%] top-[30%] w-[300px] h-[300px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(88, 28, 135, 0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute right-[25%] top-[60%] w-[400px] h-[400px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(88, 28, 135, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-[60%] top-[15%] w-[250px] h-[250px] rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(88, 28, 135, 0.13) 0%, transparent 70%)",
        }}
      />

      {/* Static light rays */}
      <div
        className="absolute top-0 left-1/4 w-px h-full opacity-15"
        style={{
          background:
            "linear-gradient(to bottom, rgba(88, 28, 135, 0.3) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 right-1/3 w-px h-full opacity-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(120, 113, 108, 0.2) 0%, transparent 50%)",
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(88, 28, 135, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(68, 64, 60, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(88, 28, 135, 0.08) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
};

export { GalleryBackground };
export default GalleryBackground;
