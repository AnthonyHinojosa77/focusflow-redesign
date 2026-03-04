/**
 * useTimer — Pomodoro timer hook
 * Neon Terminal design: timer drives the entire UI state
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addSession,
  generateId,
  getSettings,
  type FocusSession,
} from "@/lib/store";

export type TimerPhase = "focus" | "short-break" | "long-break";
export type TimerStatus = "idle" | "running" | "paused" | "completed";

interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  timeRemaining: number; // seconds
  totalTime: number; // seconds
  sessionsCompleted: number;
  currentSessionStart: number | null;
}

export function useTimer(onSessionComplete?: (session: FocusSession) => void) {
  const settings = getSettings();

  const [state, setState] = useState<TimerState>({
    phase: "focus",
    status: "idle",
    timeRemaining: settings.focusDuration * 60,
    totalTime: settings.focusDuration * 60,
    sessionsCompleted: 0,
    currentSessionStart: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.timeRemaining <= 1) {
        // Timer completed
        return { ...prev, timeRemaining: 0, status: "completed" };
      }
      return { ...prev, timeRemaining: prev.timeRemaining - 1 };
    });
  }, []);

  // Handle completion
  useEffect(() => {
    if (state.status === "completed") {
      clearTimer();
    }
  }, [state.status, clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      status: "running",
      currentSessionStart: prev.currentSessionStart || Date.now(),
    }));
    intervalRef.current = setInterval(tick, 1000);
  }, [clearTimer, tick]);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, status: "paused" }));
  }, [clearTimer]);

  const resume = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, status: "running" }));
    intervalRef.current = setInterval(tick, 1000);
  }, [clearTimer, tick]);

  const completeSession = useCallback(
    (label: string, note: string, mood: number, tags: string[]) => {
      const s = stateRef.current;
      const session: FocusSession = {
        id: generateId(),
        startTime: s.currentSessionStart || Date.now(),
        endTime: Date.now(),
        duration: s.totalTime - s.timeRemaining,
        type: s.phase,
        label,
        note,
        mood,
        tags,
      };
      addSession(session);
      onSessionComplete?.(session);

      // Determine next phase
      const currentSettings = getSettings();
      const newSessionsCompleted =
        s.phase === "focus" ? s.sessionsCompleted + 1 : s.sessionsCompleted;
      let nextPhase: TimerPhase;
      let nextDuration: number;

      if (s.phase === "focus") {
        if (
          newSessionsCompleted % currentSettings.sessionsBeforeLongBreak ===
          0
        ) {
          nextPhase = "long-break";
          nextDuration = currentSettings.longBreakDuration;
        } else {
          nextPhase = "short-break";
          nextDuration = currentSettings.shortBreakDuration;
        }
      } else {
        nextPhase = "focus";
        nextDuration = currentSettings.focusDuration;
      }

      setState({
        phase: nextPhase,
        status: "idle",
        timeRemaining: nextDuration * 60,
        totalTime: nextDuration * 60,
        sessionsCompleted: newSessionsCompleted,
        currentSessionStart: null,
      });
    },
    [onSessionComplete]
  );

  const reset = useCallback(() => {
    clearTimer();
    const currentSettings = getSettings();
    setState((prev) => ({
      ...prev,
      status: "idle",
      timeRemaining:
        prev.phase === "focus"
          ? currentSettings.focusDuration * 60
          : prev.phase === "short-break"
            ? currentSettings.shortBreakDuration * 60
            : currentSettings.longBreakDuration * 60,
      totalTime:
        prev.phase === "focus"
          ? currentSettings.focusDuration * 60
          : prev.phase === "short-break"
            ? currentSettings.shortBreakDuration * 60
            : currentSettings.longBreakDuration * 60,
      currentSessionStart: null,
    }));
  }, [clearTimer]);

  const skipToNext = useCallback(() => {
    clearTimer();
    const currentSettings = getSettings();
    const s = stateRef.current;
    let nextPhase: TimerPhase;
    let nextDuration: number;

    if (s.phase === "focus") {
      nextPhase = "short-break";
      nextDuration = currentSettings.shortBreakDuration;
    } else {
      nextPhase = "focus";
      nextDuration = currentSettings.focusDuration;
    }

    setState((prev) => ({
      ...prev,
      phase: nextPhase,
      status: "idle",
      timeRemaining: nextDuration * 60,
      totalTime: nextDuration * 60,
      currentSessionStart: null,
    }));
  }, [clearTimer]);

  const progress =
    state.totalTime > 0
      ? ((state.totalTime - state.timeRemaining) / state.totalTime) * 100
      : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    ...state,
    progress,
    start,
    pause,
    resume,
    reset,
    skipToNext,
    completeSession,
  };
}
