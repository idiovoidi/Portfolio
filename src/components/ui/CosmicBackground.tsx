import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../utils/animations";

type Star = {
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  vx: number;
  vy: number;
  opacity: number;
};

const placeOnRim = (star: Star, width: number, height: number) => {
  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) {
    star.x = Math.random() * width;
    star.y = -8;
  } else if (edge === 1) {
    star.x = width + 8;
    star.y = Math.random() * height;
  } else if (edge === 2) {
    star.x = Math.random() * width;
    star.y = height + 8;
  } else {
    star.x = -8;
    star.y = Math.random() * height;
  }
};

/**
 * CosmicBackground - Starfield that drifts until the hero portal is on screen,
 * then falls inward and is swallowed by it.
 */
export const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Star[] = [];
    const particleCount = 140;
    for (let i = 0; i < particleCount; i++) {
      const driftX = (Math.random() - 0.5) * 12;
      const driftY = (Math.random() - 0.5) * 12;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.4,
        driftX,
        driftY,
        vx: driftX,
        vy: driftY,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, energy: 0 };
    const onPointerMove = (event: MouseEvent) => {
      if (pointer.x > -1000) {
        pointer.vx = event.clientX - pointer.x;
        pointer.vy = event.clientY - pointer.y;
        pointer.energy = Math.min(1, Math.hypot(pointer.vx, pointer.vy) / 18);
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener("mousemove", onPointerMove);

    let animationFrameId = 0;
    let last = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 0;

      const hero = document.getElementById("home");
      let portalX = width / 2;
      let portalY = height / 2;
      let pull = 0;
      if (hero && !reduced) {
        const rect = hero.getBoundingClientRect();
        portalX = rect.left + rect.width / 2;
        portalY = rect.top + rect.height / 2;
        const inView = portalY > -80 && portalY < height + 80;
        if (inView) {
          pull = Math.max(
            0,
            1 - Math.abs(portalY - height * 0.5) / (height * 0.75),
          );
        }
      }

      pointer.energy *= reduced ? 0 : 0.88;

      particles.forEach((particle) => {
        if (pull > 0.04 && pointer.energy > 0.06) {
          const pdx = particle.x - pointer.x;
          const pdy = particle.y - pointer.y;
          const pd = Math.hypot(pdx, pdy) || 1;
          const reach = 170;
          if (pd < reach) {
            const falloff = (1 - pd / reach) ** 2 * pointer.energy;
            particle.vx +=
              pointer.vx * 14 * falloff + (-pdy / pd) * 36 * falloff;
            particle.vy +=
              pointer.vy * 14 * falloff + (pdx / pd) * 36 * falloff;
          }
        }

        if (pull > 0.04) {
          const dx = portalX - particle.x;
          const dy = portalY - particle.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 78) {
            placeOnRim(particle, width, height);
            particle.vx = particle.driftX;
            particle.vy = particle.driftY;
          } else {
            const accel = (pull * 92000) / (dist + 160);
            particle.vx += (dx / dist) * accel * dt;
            particle.vy += (dy / dist) * accel * dt;
          }
        }

        const drag = pull > 0.04 ? 0.35 : 2.4;
        particle.vx += (particle.driftX - particle.vx) * Math.min(1, drag * dt);
        particle.vy += (particle.driftY - particle.vy) * Math.min(1, drag * dt);

        const speed = Math.hypot(particle.vx, particle.vy);
        const maxSpeed = 28 + pull * 640;
        if (speed > maxSpeed) {
          particle.vx *= maxSpeed / speed;
          particle.vy *= maxSpeed / speed;
        }

        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        if (pull <= 0.04) {
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        } else if (
          particle.x < -40 ||
          particle.x > width + 40 ||
          particle.y < -40 ||
          particle.y > height + 40
        ) {
          placeOnRim(particle, width, height);
        }

        const distToPortal = Math.hypot(
          portalX - particle.x,
          portalY - particle.y,
        );
        const proximity = pull > 0 ? Math.max(0, 1 - distToPortal / 520) : 0;
        const cursorGlow =
          pointer.energy > 0.06
            ? Math.max(
                0,
                1 -
                  Math.hypot(particle.x - pointer.x, particle.y - pointer.y) /
                    170,
              )
            : 0;
        const alpha = Math.min(
          0.95,
          particle.opacity +
            proximity * 0.45 +
            cursorGlow * pointer.energy * 0.4,
        );

        if (speed > 40 && pull > 0.04) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(
            particle.x - particle.vx * 0.02,
            particle.y - particle.vy * 0.02,
          );
          ctx.strokeStyle = `rgba(196, 181, 253, ${alpha * 0.7})`;
          ctx.lineWidth = particle.size;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
