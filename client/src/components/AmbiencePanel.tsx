/**
 * AmbiencePanel — Ambient soundscape selector
 * Design: Neon Terminal — glowing cards with atmospheric images
 */
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AMBIENCE_OPTIONS } from "@/lib/ambience";

interface AmbiencePanelProps {
  currentId: string;
  volume: number;
  isPlaying: boolean;
  onSelect: (id: string) => void;
  onVolumeChange: (v: number) => void;
  onToggle: () => void;
}

export default function AmbiencePanel({
  currentId,
  volume,
  isPlaying,
  onSelect,
  onVolumeChange,
}: AmbiencePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">
          Soundscape
        </h3>
        {currentId !== "none" && (
          <div className="flex items-center gap-2 w-32">
            <VolumeX size={12} className="text-muted-foreground shrink-0" />
            <Slider
              value={[volume]}
              onValueChange={([v]) => onVolumeChange(v)}
              max={100}
              step={1}
              className="flex-1"
            />
            <Volume2 size={12} className="text-muted-foreground shrink-0" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {AMBIENCE_OPTIONS.map((option) => {
          const isActive = currentId === option.id && isPlaying;
          const isSelected = currentId === option.id;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.id)}
              className={`relative overflow-hidden rounded-lg border p-3 text-left transition-all ${
                isSelected
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/50 bg-panel hover:bg-panel-hover hover:border-border"
              }`}
            >
              {/* Background image for non-silence options */}
              {option.image && (
                <div
                  className="absolute inset-0 opacity-15 bg-cover bg-center"
                  style={{ backgroundImage: `url(${option.image})` }}
                />
              )}

              <div className="relative z-[1]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{option.icon}</span>
                  <span
                    className={`font-mono text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {option.name}
                  </span>
                  {isActive && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-neon-cyan ml-auto"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/70">
                  {option.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
