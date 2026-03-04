/**
 * SessionHistory — Terminal-style session log
 * Design: Neon Terminal — scrolling log entries like a terminal output
 */
import { motion } from "framer-motion";
import { Zap, Coffee, Clock } from "lucide-react";
import { getSessions, type FocusSession } from "@/lib/store";

export default function SessionHistory() {
  const sessions = getSessions()
    .filter((s) => s.type === "focus")
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 20);

  if (sessions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-panel mx-auto mb-3 flex items-center justify-center">
          <Clock size={20} className="text-muted-foreground" />
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          No sessions yet. Start your first focus session!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {sessions.map((session, i) => (
        <SessionEntry key={session.id} session={session} index={i} />
      ))}
    </div>
  );
}

function SessionEntry({
  session,
  index,
}: {
  session: FocusSession;
  index: number;
}) {
  const time = new Date(session.startTime);
  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = time.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
  const mins = Math.round(session.duration / 60);

  const moodEmoji = ["", "😩", "😐", "🙂", "😊", "🔥"][session.mood] || "🙂";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-card/50 border border-border/30 hover:border-border/60 hover:bg-card transition-all group"
    >
      {/* Icon */}
      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        {session.type === "focus" ? (
          <Zap size={13} className="text-neon-cyan" />
        ) : (
          <Coffee size={13} className="text-neon-green" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-foreground truncate">
            {session.label || "Focus Session"}
          </span>
          <span className="text-xs">{moodEmoji}</span>
        </div>
        {session.note && (
          <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5 truncate">
            {session.note}
          </p>
        )}
        {session.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/5 text-primary/70 border border-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="text-right shrink-0">
        <div className="font-mono text-[10px] text-muted-foreground">
          {mins}m
        </div>
        <div className="font-mono text-[9px] text-muted-foreground/50">
          {dateStr}
        </div>
        <div className="font-mono text-[9px] text-muted-foreground/50">
          {timeStr}
        </div>
      </div>
    </motion.div>
  );
}
