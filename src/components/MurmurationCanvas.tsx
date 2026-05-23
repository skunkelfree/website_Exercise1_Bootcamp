import { useEffect, useRef } from "react";

/**
 * Background "starling murmuration" — ~180 1px grains that lag toward
 * the cursor with cohesion + slight randomness, producing a slow, viscous
 * flock movement. Pointer-events none, sits behind all content.
 */
export function MurmurationCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Cursor target with lag (so flock can never catch up cleanly)
    const target = { x: w / 2, y: h / 2 };
    const lagged = { x: w / 2, y: h / 2 };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    // Particles
    const N = 180;
    type P = { x: number; y: number; vx: number; vy: number; a: number };
    const ps: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      a: 0.25 + Math.random() * 0.55,
    }));

    let raf = 0;
    const tick = () => {
      // Lagged target — viscous follow
      lagged.x += (target.x - lagged.x) * 0.015;
      lagged.y += (target.y - lagged.y) * 0.015;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < N; i++) {
        const p = ps[i];
        // Steer toward lagged target (cohesion)
        const dx = lagged.x - p.x;
        const dy = lagged.y - p.y;
        const d = Math.hypot(dx, dy) + 0.001;
        const steer = 0.0008; // very gentle pull
        p.vx += (dx / d) * steer;
        p.vy += (dy / d) * steer;

        // tiny wander
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // viscous damping — flock stays slow
        p.vx *= 0.94;
        p.vy *= 0.94;

        // clamp speed
        const sp = Math.hypot(p.vx, p.vy);
        const max = 0.9;
        if (sp > max) {
          p.vx = (p.vx / sp) * max;
          p.vy = (p.vy / sp) * max;
        }

        p.x += p.vx;
        p.y += p.vy;

        // wrap edges
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fillRect(p.x, p.y, 1, 1);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
