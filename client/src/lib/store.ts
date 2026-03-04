/**
 * FocusFlow Store — localStorage-backed state management
 * Design: Neon Terminal / Cyberpunk command center
 */

export interface FocusSession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // seconds
  type: "focus" | "short-break" | "long-break";
  label: string;
  note: string;
  mood: number; // 1-5
  tags: string[];
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  totalFocusMinutes: number;
  sessionsCompleted: number;
  avgMood: number;
  streak: number;
}

export interface AppSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  selectedAmbience: string;
  ambienceVolume: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  dailyGoalMinutes: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  selectedAmbience: "none",
  ambienceVolume: 50,
  autoStartBreaks: false,
  autoStartFocus: false,
  dailyGoalMinutes: 120,
};

// Safe date formatting that avoids toISOString timezone issues
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function getSessions(): FocusSession[] {
  return loadFromStorage<FocusSession[]>("focusflow_sessions", []);
}

export function addSession(session: FocusSession) {
  const sessions = getSessions();
  sessions.push(session);
  saveToStorage("focusflow_sessions", sessions);
}

export function getSettings(): AppSettings {
  return loadFromStorage<AppSettings>("focusflow_settings", DEFAULT_SETTINGS);
}

export function updateSettings(partial: Partial<AppSettings>) {
  const current = getSettings();
  const updated = { ...current, ...partial };
  saveToStorage("focusflow_settings", updated);
  return updated;
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getTodayStats(): DayStats {
  const today = getTodayKey();
  const sessions = getSessions().filter((s) => {
    const d = formatDateKey(new Date(s.startTime));
    return d === today && s.type === "focus";
  });

  const totalFocusMinutes = sessions.reduce(
    (acc, s) => acc + s.duration / 60,
    0
  );
  const avgMood =
    sessions.length > 0
      ? sessions.reduce((acc, s) => acc + s.mood, 0) / sessions.length
      : 0;

  return {
    date: today,
    totalFocusMinutes: Math.round(totalFocusMinutes),
    sessionsCompleted: sessions.length,
    avgMood: Math.round(avgMood * 10) / 10,
    streak: calculateStreak(),
  };
}

export function getWeekStats(): DayStats[] {
  const stats: DayStats[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatDateKey(d);
    const sessions = getSessions().filter((s) => {
      const sd = formatDateKey(new Date(s.startTime));
      return sd === key && s.type === "focus";
    });
    const totalFocusMinutes = sessions.reduce(
      (acc, s) => acc + s.duration / 60,
      0
    );
    const avgMood =
      sessions.length > 0
        ? sessions.reduce((acc, s) => acc + s.mood, 0) / sessions.length
        : 0;
    stats.push({
      date: key,
      totalFocusMinutes: Math.round(totalFocusMinutes),
      sessionsCompleted: sessions.length,
      avgMood: Math.round(avgMood * 10) / 10,
      streak: 0,
    });
  }
  return stats;
}

function calculateStreak(): number {
  let streak = 0;
  const d = new Date();
  let skippedToday = false;
  let iterations = 0;
  while (iterations < 400) {
    iterations++;
    const key = formatDateKey(d);
    const sessions = getSessions().filter((s) => {
      const sd = formatDateKey(new Date(s.startTime));
      return sd === key && s.type === "focus";
    });
    if (sessions.length === 0 && streak > 0) break;
    if (sessions.length === 0 && !skippedToday) {
      skippedToday = true;
      d.setDate(d.getDate() - 1);
      continue;
    }
    if (sessions.length === 0) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
