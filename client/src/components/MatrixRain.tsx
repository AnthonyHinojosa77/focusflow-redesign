/**
 * MatrixRain — Subtle animated background effect
 * Design: Neon Terminal — falling characters in the background
 */
import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: number[] = [];

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
    const fontSize = 12;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const colCount = Math.floor(canvas.width / fontSize);
      columns = Array(colCount).fill(0).map(() => Math.random() * canvas.height / fontSize);
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

      animationId = requestAnimationFrame(draw);
    };

    // Slow down the animation
    let lastTime = 0;
    const slowDraw = (time: number) => {
      if (time - lastTime > 80) {
        draw();
        lastTime = time;
      } else {
        animationId = requestAnimationFrame(slowDraw);
      }
    };

    animationId = requestAnimationFrame(slowDraw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}
