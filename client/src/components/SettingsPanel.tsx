/**
 * SettingsPanel — Timer configuration
 * Design: Neon Terminal — compact settings with slider controls
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getSettings, updateSettings, type AppSettings } from "@/lib/store";

interface SettingsPanelProps {
  onSettingsChange: () => void;
}

export default function SettingsPanel({ onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  const update = (partial: Partial<AppSettings>) => {
    const updated = updateSettings(partial);
    setSettings(updated);
    onSettingsChange();
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        <Settings size={15} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-card border border-border rounded-xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-lg font-semibold text-foreground mb-6">
                Timer Settings
              </h3>

              <div className="space-y-5">
                <SettingSlider
                  label="Focus Duration"
                  value={settings.focusDuration}
                  min={5}
                  max={90}
                  step={5}
                  unit="min"
                  onChange={(v) => update({ focusDuration: v })}
                />
                <SettingSlider
                  label="Short Break"
                  value={settings.shortBreakDuration}
                  min={1}
                  max={15}
                  step={1}
                  unit="min"
                  onChange={(v) => update({ shortBreakDuration: v })}
                />
                <SettingSlider
                  label="Long Break"
                  value={settings.longBreakDuration}
                  min={5}
                  max={30}
                  step={5}
                  unit="min"
                  onChange={(v) => update({ longBreakDuration: v })}
                />
                <SettingSlider
                  label="Sessions Before Long Break"
                  value={settings.sessionsBeforeLongBreak}
                  min={2}
                  max={8}
                  step={1}
                  unit=""
                  onChange={(v) => update({ sessionsBeforeLongBreak: v })}
                />
                <SettingSlider
                  label="Daily Goal"
                  value={settings.dailyGoalMinutes}
                  min={30}
                  max={480}
                  step={15}
                  unit="min"
                  onChange={(v) => update({ dailyGoalMinutes: v })}
                />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    Auto-start breaks
                  </span>
                  <Switch
                    checked={settings.autoStartBreaks}
                    onCheckedChange={(v) => update({ autoStartBreaks: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    Auto-start focus
                  </span>
                  <Switch
                    checked={settings.autoStartFocus}
                    onCheckedChange={(v) => update({ autoStartFocus: v })}
                  />
                </div>
              </div>

              <Button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 font-mono text-xs"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SettingSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-medium text-foreground">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
