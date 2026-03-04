/**
 * StatsPanel — Productivity analytics dashboard
 * Design: Neon Terminal — data-dense, glowing charts
 */
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";
import { getTodayStats, getWeekStats, getSettings } from "@/lib/store";

export default function StatsPanel() {
  const today = getTodayStats();
  const week = getWeekStats();
  const settings = getSettings();
  const goalProgress = Math.min(
    (today.totalFocusMinutes / settings.dailyGoalMinutes) * 100,
    100
  );

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = week.map((d) => {
    const date = new Date(d.date + "T12:00:00");
    return {
      day: dayNames[date.getDay()],
      minutes: d.totalFocusMinutes,
      sessions: d.sessionsCompleted,
      isToday: d.date === today.date,
    };
  });

  const totalWeekMinutes = week.reduce(
    (acc, d) => acc + d.totalFocusMinutes,
    0
  );
  const totalWeekSessions = week.reduce(
    (acc, d) => acc + d.sessionsCompleted,
    0
  );

  return (
    <div className="space-y-4">
      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<Target size={14} className="text-neon-cyan" />}
          label="Daily Goal"
          value={`${Math.round(goalProgress)}%`}
          sub={`${today.totalFocusMinutes}/${settings.dailyGoalMinutes} min`}
          color="neon-cyan"
          progress={goalProgress}
        />
        <StatCard
          icon={<Flame size={14} className="text-neon-magenta" />}
          label="Streak"
          value={`${today.streak}`}
          sub={today.streak === 1 ? "day" : "days"}
          color="neon-magenta"
        />
        <StatCard
          icon={<Clock size={14} className="text-neon-green" />}
          label="This Week"
          value={`${Math.round(totalWeekMinutes / 60 * 10) / 10}h`}
          sub={`${totalWeekSessions} sessions`}
          color="neon-green"
        />
        <StatCard
          icon={<TrendingUp size={14} className="text-neon-amber" />}
          label="Today"
          value={`${today.sessionsCompleted}`}
          sub="sessions done"
          color="neon-amber"
        />
      </div>

      {/* Weekly chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
          Weekly Focus (minutes)
        </h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "oklch(0.5 0.01 270)",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono",
                }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0.01 270)",
                  border: "1px solid oklch(0.25 0.015 270)",
                  borderRadius: "8px",
                  fontFamily: "JetBrains Mono",
                  fontSize: "11px",
                  color: "oklch(0.92 0.01 250)",
                }}
                cursor={{ fill: "oklch(0.2 0.01 270 / 0.3)" }}
                formatter={(value: number) => [`${value} min`, "Focus"]}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.isToday
                        ? "oklch(0.85 0.18 192)"
                        : "oklch(0.85 0.18 192 / 0.3)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  progress?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-lg p-3 relative overflow-hidden"
    >
      {/* Progress bar for goal */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
          <motion.div
            className={`h-full bg-${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              background:
                color === "neon-cyan"
                  ? "oklch(0.85 0.18 192)"
                  : color === "neon-magenta"
                    ? "oklch(0.65 0.28 5)"
                    : color === "neon-green"
                      ? "oklch(0.82 0.26 145)"
                      : "oklch(0.8 0.18 75)",
            }}
          />
        </div>
      )}
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="font-mono text-xl font-semibold text-foreground">
        {value}
      </div>
      <div className="font-mono text-[10px] text-muted-foreground/70">
        {sub}
      </div>
    </motion.div>
  );
}
