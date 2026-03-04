/**
 * useAmbience — Ambient sound playback hook using Howler.js
 * Neon Terminal: soundscapes enhance the deep work atmosphere
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { AMBIENCE_OPTIONS } from "@/lib/ambience";
import { getSettings, updateSettings } from "@/lib/store";

export function useAmbience() {
  const settings = getSettings();
  const [currentId, setCurrentId] = useState(settings.selectedAmbience);
  const [volume, setVolume] = useState(settings.ambienceVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  const stopSound = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.fade(howlRef.current.volume(), 0, 500);
      setTimeout(() => {
        howlRef.current?.stop();
        howlRef.current?.unload();
        howlRef.current = null;
      }, 500);
    }
    setIsPlaying(false);
  }, []);

  const playSound = useCallback(
    (id: string) => {
      stopSound();
      const option = AMBIENCE_OPTIONS.find((o) => o.id === id);
      if (!option || !option.url || id === "none") {
        setCurrentId("none");
        updateSettings({ selectedAmbience: "none" });
        return;
      }

      const howl = new Howl({
        src: [option.url],
        loop: true,
        volume: volume / 100,
        html5: true,
      });

      howl.play();
      howlRef.current = howl;
      setIsPlaying(true);
      setCurrentId(id);
      updateSettings({ selectedAmbience: id });
    },
    [stopSound, volume]
  );

  const changeVolume = useCallback(
    (v: number) => {
      setVolume(v);
      updateSettings({ ambienceVolume: v });
      if (howlRef.current) {
        howlRef.current.volume(v / 100);
      }
    },
    []
  );

  const toggle = useCallback(() => {
    if (isPlaying) {
      stopSound();
    } else if (currentId && currentId !== "none") {
      playSound(currentId);
    }
  }, [isPlaying, currentId, stopSound, playSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }
    };
  }, []);

  return {
    currentId,
    volume,
    isPlaying,
    playSound,
    stopSound,
    changeVolume,
    toggle,
  };
}
