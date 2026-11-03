import type React from "react";
import { useEffect, useRef } from "react";
import {
  cursorX,
  cursorY,
  getVoidState,
  type VoidMode,
} from "../../utils/voidStore";

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

/** How long a trail point lives, per mode (ms). */
const LIFE: Record<VoidMode, number> = {
  default: 350,
  glitch: 450,
  warm: 500,
};

/**
 * A faint fading trail behind the native cursor. Slightly stretched and
 * glitchy over Projects / 3D, soft and warm over Commercial. The native
 * cursor is left alone.
 */
export const VoidCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const points: TrailPoint[] = [];
    let running = false;
    let raf = 0;

    const draw = (now: number) => {
      const { mode } = getVoidState();
      const life = LIFE[mode];
      while (points.length && now - points[0].t > life) points.shift();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (mode === "glitch") drawGlitchTrail(ctx, points, now, life);
      else if (mode === "warm") drawWarmTrail(ctx, points, now, life);
      else drawDefaultTrail(ctx, points, now, life);

      if (points.length) raf = requestAnimationFrame(draw);
      else running = false;
    };

    const unsubscribe = cursorX.on("change", () => {
      points.push({ x: cursorX.get(), y: cursorY.get(), t: performance.now() });
      if (points.length > 40) points.shift();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    />
  );
};

function drawDefaultTrail(
  ctx: CanvasRenderingContext2D,
  pts: TrailPoint[],
  now: number,
  life: number,
) {
  ctx.lineCap = "round";
  for (let i = 1; i < pts.length; i++) {
    const a = 1 - (now - pts[i].t) / life;
    ctx.strokeStyle = `rgba(167, 139, 250, ${a * 0.22})`;
    ctx.lineWidth = 1 + a * 1.5;
    ctx.beginPath();
    ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
    ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }
}

/** Faint cyan/magenta split with a slight stretch; no tearing. */
function drawGlitchTrail(
  ctx: CanvasRenderingContext2D,
  pts: TrailPoint[],
  now: number,
  life: number,
) {
  for (let i = 1; i < pts.length; i++) {
    const a = 1 - (now - pts[i].t) / life;
    for (const [color, dx] of [
      ["rgba(6, 182, 212,", -1],
      ["rgba(236, 72, 153,", 1],
    ] as const) {
      ctx.strokeStyle = `${color} ${a * 0.22})`;
      ctx.lineWidth = 1 + a;
      ctx.beginPath();
      ctx.moveTo(pts[i - 1].x + dx, pts[i - 1].y);
      ctx.lineTo(
        pts[i].x + dx + (pts[i].x - pts[i - 1].x) * 0.8,
        pts[i].y + (pts[i].y - pts[i - 1].y) * 0.2,
      );
      ctx.stroke();
    }
  }
}

/** Soft, sparse embers instead of a line. */
function drawWarmTrail(
  ctx: CanvasRenderingContext2D,
  pts: TrailPoint[],
  now: number,
  life: number,
) {
  for (let i = 0; i < pts.length; i += 3) {
    const a = 1 - (now - pts[i].t) / life;
    const r = 3 + (1 - a) * 8;
    const g = ctx.createRadialGradient(
      pts[i].x,
      pts[i].y,
      0,
      pts[i].x,
      pts[i].y,
      r,
    );
    g.addColorStop(0, `rgba(253, 186, 116, ${a * 0.18})`);
    g.addColorStop(1, "rgba(251, 113, 133, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default VoidCursor;
