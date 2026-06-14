/**
 * MatrixRain — Subtle animated background effect
 * Design: Neon Terminal — falling characters in the background
 *
 * Performance / accessibility:
 *  - Respects `prefers-reduced-motion`: renders a single static dim frame
 *    instead of running the rAF loop.
 *  - Throttles the animation to ~24fps via a time accumulator instead of
 *    redrawing every frame.
 *  - Pauses the loop while the tab is hidden (visibilitychange).
 */
import { useEffect, useRef } from "react";

// Target ~24fps for the rain so it stays subtle and easy on the CPU.
const FRAME_INTERVAL = 1000 / 24;

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number | null = null;
    let columns: number[] = [];

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
    const fontSize = 12;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const colCount = Math.floor(canvas.width / fontSize);
      columns = Array(colCount)
        .fill(0)
        .map(() => (Math.random() * canvas.height) / fontSize);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        // Vary color between cyan and dim
        const brightness = Math.random();
        if (brightness > 0.98) {
          ctx.fillStyle = "rgba(0, 240, 255, 0.6)";
        } else if (brightness > 0.95) {
          ctx.fillStyle = "rgba(0, 240, 255, 0.3)";
        } else {
          ctx.fillStyle = "rgba(0, 240, 255, 0.06)";
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          columns[i] = 0;
        }
        columns[i] += 0.5;
      }
    };

    // Static dim frame for reduced-motion (and as an initial paint).
    const drawStatic = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(0, 240, 255, 0.06)";
      for (let i = 0; i < columns.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, columns[i] * fontSize);
      }
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Throttled rAF loop using a time accumulator.
    let lastDraw = 0;
    const loop = (time: number) => {
      animationId = requestAnimationFrame(loop);
      if (time - lastDraw >= FRAME_INTERVAL) {
        lastDraw = time;
        draw();
      }
    };

    const stop = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const start = () => {
      if (reduceMotion.matches) {
        // No animation requested — paint one static dim frame.
        drawStatic();
        return;
      }
      if (animationId === null && !document.hidden) {
        lastDraw = 0;
        animationId = requestAnimationFrame(loop);
      }
    };

    // Pause when the tab is hidden, resume when visible.
    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    // React to live changes in the reduced-motion preference.
    const handleMotionChange = () => {
      stop();
      start();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", handleMotionChange);

    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}
