/**
 * TimerControls — Play/Pause/Reset/Skip buttons
 * Design: Neon Terminal — minimal, glowing control bar
 */
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import type { TimerStatus } from "@/hooks/useTimer";

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-3 mt-8">
      {/* Reset */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        title="Reset"
      >
        <RotateCcw size={16} />
      </motion.button>

      {/* Main play/pause button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={
          status === "idle" || status === "completed"
            ? onStart
            : status === "running"
              ? onPause
              : onResume
        }
        className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center neon-glow-cyan transition-all"
      >
        {status === "running" ? (
          <Pause size={24} />
        ) : (
          <Play size={24} className="ml-1" />
        )}
      </motion.button>

      {/* Skip */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSkip}
        className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        title="Skip to next"
      >
        <SkipForward size={16} />
      </motion.button>
    </div>
  );
}
