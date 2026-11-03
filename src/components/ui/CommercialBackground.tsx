const CommercialBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 18%, rgba(255, 248, 225, 0.92) 0%, rgba(232, 210, 160, 0.55) 32%, rgba(40, 28, 22, 0.88) 68%, rgba(0, 0, 0, 0.96) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-70 commercial-godrays"
        style={{
          background: `
            conic-gradient(
              from 210deg at 50% -5%,
              transparent 0deg,
              rgba(255, 244, 210, 0.08) 12deg,
              rgba(255, 236, 179, 0.38) 18deg,
              rgba(255, 250, 235, 0.55) 22deg,
              rgba(255, 236, 179, 0.28) 28deg,
              transparent 38deg,
              transparent 50deg,
              rgba(255, 244, 210, 0.12) 58deg,
              rgba(255, 250, 235, 0.42) 64deg,
              rgba(255, 236, 179, 0.18) 72deg,
              transparent 86deg
            )
          `,
        }}
      />

      <div
        className="absolute left-1/2 top-0 h-[70%] w-[18%] -translate-x-1/2 blur-2xl commercial-godray-core"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 252, 240, 0.55) 0%, rgba(253, 230, 138, 0.22) 42%, transparent 100%)",
        }}
      />

      <div
        className="absolute left-[18%] top-[8%] h-[55%] w-[8%] -rotate-12 blur-xl opacity-50"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 248, 220, 0.35) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-[20%] top-[6%] h-[50%] w-[7%] rotate-12 blur-xl opacity-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 248, 220, 0.3) 0%, transparent 100%)",
        }}
      />

      <div
        className="absolute left-1/2 top-[12%] h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 252, 235, 0.7) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(0, 0, 0, 0.55) 78%, rgba(0, 0, 0, 0.9) 100%)",
        }}
      />
    </div>
  );
};

export { CommercialBackground };
export default CommercialBackground;
