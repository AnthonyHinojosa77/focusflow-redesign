/**
 * NeonTimer — Circular SVG timer with neon glow effects
 * Design: Cyberpunk command center — the timer is the focal point
 */
import { motion } from "framer-motion";
import type { TimerPhase, TimerStatus } from "@/hooks/useTimer";

interface NeonTimerProps {
  timeRemaining: number;
  totalTime: number;
  progress: number;
  phase: TimerPhase;
  status: TimerStatus;
}

export default function NeonTimer({
  timeRemaining,
  totalTime,
  progress,
  phase,
  status,
}: NeonTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // SVG circle params
  const size = 320;
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const phaseColor =
    phase === "focus"
      ? "oklch(0.85 0.18 192)"
      : phase === "short-break"
        ? "oklch(0.82 0.26 145)"
        : "oklch(0.65 0.28 5)";

  const phaseLabel =
    phase === "focus"
      ? "DEEP FOCUS"
      : phase === "short-break"
        ? "SHORT BREAK"
        : "LONG BREAK";

  const glowFilter =
    phase === "focus"
      ? "drop-shadow(0 0 8px oklch(0.85 0.18 192 / 0.6)) drop-shadow(0 0 20px oklch(0.85 0.18 192 / 0.3))"
      : phase === "short-break"
        ? "drop-shadow(0 0 8px oklch(0.82 0.26 145 / 0.6)) drop-shadow(0 0 20px oklch(0.82 0.26 145 / 0.3))"
        : "drop-shadow(0 0 8px oklch(0.65 0.28 5 / 0.6)) drop-shadow(0 0 20px oklch(0.65 0.28 5 / 0.3))";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size + 40,
          height: size + 40,
          background: `radial-gradient(circle, ${phaseColor.replace(")", " / 0.06)")} 0%, transparent 70%)`,
        }}
        animate={
          status === "running"
            ? {
                scale: [1, 1.03, 1],
                opacity: [0.5, 0.8, 0.5],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-[1]"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.2 0.01 270)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={phaseColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: glowFilter }}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "linear" }}
        />

        {/* Inner decorative ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 20}
          fill="none"
          stroke="oklch(0.2 0.01 270 / 0.5)"
          strokeWidth={1}
          strokeDasharray="4 8"
        />

        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isMajor = i % 5 === 0;
          const innerR = radius - (isMajor ? 14 : 10);
          const outerR = radius - 6;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * Math.cos(angle)}
              y1={size / 2 + innerR * Math.sin(angle)}
              x2={size / 2 + outerR * Math.cos(angle)}
              y2={size / 2 + outerR * Math.sin(angle)}
              stroke={
                isMajor
                  ? "oklch(0.4 0.01 270)"
                  : "oklch(0.25 0.01 270)"
              }
              strokeWidth={isMajor ? 1.5 : 0.5}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute z-[2] flex flex-col items-center">
        <motion.span
          className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
          style={{ color: phaseColor }}
          animate={
            status === "running"
              ? { opacity: [0.7, 1, 0.7] }
              : { opacity: 1 }
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          {phaseLabel}
        </motion.span>

        <motion.span
          className="font-mono text-6xl font-light tracking-wider"
          style={{
            color: "oklch(0.95 0 0)",
            textShadow: `0 0 20px ${phaseColor.replace(")", " / 0.4)")}, 0 0 40px ${phaseColor.replace(")", " / 0.15)")}`,
          }}
          key={timeStr}
          initial={false}
        >
          {timeStr}
        </motion.span>

        <span className="font-mono text-[10px] text-muted-foreground mt-2 tracking-widest uppercase">
          {status === "idle"
            ? "ready"
            : status === "running"
              ? "in progress"
              : status === "paused"
                ? "paused"
                : "complete"}
        </span>

        {/* Total time indicator */}
        <span className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          {Math.floor(totalTime / 60)}:00 total
        </span>
      </div>
    </div>
  );
}
