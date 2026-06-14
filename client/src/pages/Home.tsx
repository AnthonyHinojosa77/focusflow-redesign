/**
 * FocusFlow — Home Page
 * Design: Neon Terminal / Cyberpunk command center
 * Layout: Asymmetric — large timer left, panels stacked right
 */
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, History, BarChart3, Volume2, Keyboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NeonTimer from "@/components/NeonTimer";
import TimerControls from "@/components/TimerControls";
import AmbiencePanel from "@/components/AmbiencePanel";
import SessionLog from "@/components/SessionLog";
import StatsPanel from "@/components/StatsPanel";
import SessionHistory from "@/components/SessionHistory";
import SettingsPanel from "@/components/SettingsPanel";
import MatrixRain from "@/components/MatrixRain";
import { useTimer } from "@/hooks/useTimer";
import { useAmbience } from "@/hooks/useAmbience";
import type { FocusSession } from "@/lib/store";

export default function Home() {
  const [showLog, setShowLog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onSessionComplete = useCallback((_session: FocusSession) => {
    setShowLog(true);
  }, []);

  const timer = useTimer(onSessionComplete);
  const ambience = useAmbience();

  // Show log when timer completes
  const isCompleted = timer.status === "completed";

  // Play/pause toggle that mirrors the main control button logic.
  const togglePlayPause = useCallback(() => {
    if (timer.status === "running") {
      timer.pause();
    } else if (timer.status === "paused") {
      timer.resume();
    } else if (timer.status === "completed") {
      setShowLog(true);
    } else {
      timer.start();
    }
  }, [timer]);

  // Keyboard shortcuts: Space (play/pause), R (reset).
  // Ignored while typing in an input/textarea/contenteditable.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "r" || e.key === "R") {
        if (e.metaKey || e.ctrlKey) return; // don't hijack browser reload
        e.preventDefault();
        timer.reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, timer]);

  // Browser notification when a focus session completes. Permission is
  // requested gracefully on first completion and we degrade silently if
  // it's unavailable or denied.
  useEffect(() => {
    if (!isCompleted) return;
    if (typeof Notification === "undefined") return;

    const notify = () => {
      if (Notification.permission !== "granted") return;
      try {
        new Notification("FocusFlow — session complete", {
          body:
            timer.phase === "focus"
              ? "Nice work. Time for a break."
              : "Break's over. Ready to focus?",
          tag: "focusflow-session",
        });
      } catch {
        // Some environments throw on the Notification constructor — ignore.
      }
    };

    if (Notification.permission === "default") {
      Notification.requestPermission().then(notify).catch(() => {});
    } else {
      notify();
    }
  }, [isCompleted, timer.phase]);

  const handleLogComplete = (
    label: string,
    note: string,
    mood: number,
    tags: string[]
  ) => {
    timer.completeSession(label, note, mood, tags);
    setShowLog(false);
    setRefreshKey((k) => k + 1);
  };

  const handleLogSkip = () => {
    timer.completeSession("Focus Session", "", 3, []);
    setShowLog(false);
    setRefreshKey((k) => k + 1);
  };

  const handleSettingsChange = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] scanlines" />

      {/* Main content */}
      <div className="relative z-[2] min-h-screen">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="container flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap size={14} className="text-neon-cyan" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold tracking-tight text-foreground leading-none">
                  FocusFlow
                </h1>
                <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
                  Deep Work Command Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Session counter */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/50 bg-card/50">
                <span className="font-mono text-[10px] text-muted-foreground">
                  Sessions:
                </span>
                <span className="font-mono text-xs font-semibold text-neon-cyan">
                  {timer.sessionsCompleted}
                </span>
              </div>

              {/* Keyboard shortcuts help */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Keyboard shortcuts"
                    className="w-7 h-7 rounded-md border border-border/50 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-neon-cyan hover:border-primary/30 transition-colors"
                  >
                    <Keyboard size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="font-mono text-[11px] border-primary/30"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Play / Pause</span>
                      <kbd className="px-1.5 py-0.5 rounded border border-border bg-background/60 text-neon-cyan">
                        Space
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Reset</span>
                      <kbd className="px-1.5 py-0.5 rounded border border-border bg-background/60 text-neon-cyan">
                        R
                      </kbd>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>

              <SettingsPanel onSettingsChange={handleSettingsChange} />
            </div>
          </div>
        </header>

        {/* Main layout */}
        <main className="container py-6 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            {/* Left: Timer section */}
            <div className="flex-1 flex flex-col items-center w-full lg:sticky lg:top-24">
              {/* Hero background image - subtle */}
              <div
                className="absolute top-0 left-0 right-0 h-[500px] opacity-[0.04] bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663140771997/nrNj8C9LJoShNEFPjt7DgA/focusflow-hero-bg-HvKcC8FoVgXEK4bwLTdb4A.webp)`,
                }}
              />

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <NeonTimer
                  timeRemaining={timer.timeRemaining}
                  totalTime={timer.totalTime}
                  progress={timer.progress}
                  phase={timer.phase}
                  status={timer.status}
                />
              </motion.div>

              {/* Controls */}
              <TimerControls
                status={isCompleted ? "completed" : timer.status}
                onStart={
                  isCompleted
                    ? () => {
                        setShowLog(true);
                      }
                    : timer.start
                }
                onPause={timer.pause}
                onResume={timer.resume}
                onReset={timer.reset}
                onSkip={timer.skipToNext}
              />

              {/* Phase indicators */}
              <div className="flex items-center gap-1.5 mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < timer.sessionsCompleted % 4
                        ? "bg-neon-cyan neon-glow-cyan"
                        : i === timer.sessionsCompleted % 4 &&
                            timer.phase === "focus"
                          ? "bg-neon-cyan/30 border border-neon-cyan/50"
                          : "bg-border"
                    }`}
                  />
                ))}
                <span className="font-mono text-[9px] text-muted-foreground/50 ml-1.5">
                  until long break
                </span>
              </div>
            </div>

            {/* Right: Panels */}
            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="w-full bg-card border border-border rounded-lg h-10 p-1 mb-4">
                  <TabsTrigger
                    value="stats"
                    className="flex-1 font-mono text-[11px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md"
                  >
                    <BarChart3 size={13} className="mr-1.5" />
                    Stats
                  </TabsTrigger>
                  <TabsTrigger
                    value="ambience"
                    className="flex-1 font-mono text-[11px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md"
                  >
                    <Volume2 size={13} className="mr-1.5" />
                    Sounds
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex-1 font-mono text-[11px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md"
                  >
                    <History size={13} className="mr-1.5" />
                    Log
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="mt-0">
                  <StatsPanel key={`stats-${refreshKey}`} />
                </TabsContent>

                <TabsContent value="ambience" className="mt-0">
                  <AmbiencePanel
                    currentId={ambience.currentId}
                    volume={ambience.volume}
                    isPlaying={ambience.isPlaying}
                    onSelect={ambience.playSound}
                    onVolumeChange={ambience.changeVolume}
                    onToggle={ambience.toggle}
                  />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <SessionHistory key={`history-${refreshKey}`} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 mt-auto">
          <div className="container py-4 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground/40">
              FocusFlow v1.0 — Deep Work Command Center
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/40">
              Built with ⚡ for maximum productivity
            </span>
          </div>
        </footer>
      </div>

      {/* Session log dialog */}
      <SessionLog
        isOpen={showLog || isCompleted}
        phase={timer.phase}
        duration={timer.totalTime - timer.timeRemaining}
        onComplete={handleLogComplete}
        onSkip={handleLogSkip}
      />
    </div>
  );
}
