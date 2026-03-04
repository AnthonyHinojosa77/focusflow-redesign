/**
 * SessionLog — Post-session journaling dialog
 * Design: Neon Terminal — quick, efficient logging with mood and tags
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Coffee, Brain, Code, BookOpen, Dumbbell, Music, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionLogProps {
  isOpen: boolean;
  phase: string;
  duration: number;
  onComplete: (label: string, note: string, mood: number, tags: string[]) => void;
  onSkip: () => void;
}

const MOOD_OPTIONS = [
  { value: 1, label: "Drained", emoji: "😩" },
  { value: 2, label: "Tired", emoji: "😐" },
  { value: 3, label: "Okay", emoji: "🙂" },
  { value: 4, label: "Good", emoji: "😊" },
  { value: 5, label: "Fired Up", emoji: "🔥" },
];

const TAG_OPTIONS = [
  { id: "coding", label: "Coding", icon: Code },
  { id: "writing", label: "Writing", icon: Pencil },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "creative", label: "Creative", icon: Music },
  { id: "exercise", label: "Exercise", icon: Dumbbell },
  { id: "deep-work", label: "Deep Work", icon: Brain },
];

export default function SessionLog({
  isOpen,
  phase,
  duration,
  onComplete,
  onSkip,
}: SessionLogProps) {
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onComplete(
      label || (phase === "focus" ? "Focus Session" : "Break"),
      note,
      mood,
      selectedTags
    );
    setLabel("");
    setNote("");
    setMood(3);
    setSelectedTags([]);
  };

  const mins = Math.floor(duration / 60);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-card border border-border rounded-xl p-6 relative"
          >
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {phase === "focus" ? (
                  <Zap size={18} className="text-neon-cyan" />
                ) : (
                  <Coffee size={18} className="text-neon-green" />
                )}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Session Complete
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {mins} min {phase === "focus" ? "focus" : "break"} session
                </p>
              </div>
            </div>

            {/* Label */}
            <div className="mb-4">
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1.5 block">
                What did you work on?
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., API refactor, Chapter 3..."
                className="w-full bg-input border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Mood */}
            <div className="mb-4">
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                How do you feel?
              </label>
              <div className="flex gap-2">
                {MOOD_OPTIONS.map((m) => (
                  <motion.button
                    key={m.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMood(m.value)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-all ${
                      mood === m.value
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/50 bg-transparent hover:bg-panel-hover"
                    }`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {m.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map((tag) => {
                  const Icon = tag.icon;
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <motion.button
                      key={tag.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTag(tag.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[11px] transition-all ${
                        isSelected
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <Icon size={11} />
                      {tag.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-1.5 block">
                Quick note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any thoughts about this session..."
                rows={2}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1 font-mono text-xs bg-transparent"
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 font-mono text-xs"
              >
                Log Session
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
