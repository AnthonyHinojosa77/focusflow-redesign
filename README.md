# ⚡ FocusFlow — Deep Work Command Center

A cyberpunk-themed Pomodoro timer and productivity companion built with React, TypeScript, and Tailwind CSS. FocusFlow combines a beautiful neon-glow timer with ambient soundscapes, session journaling, and productivity analytics — all wrapped in a stunning retro-futuristic terminal aesthetic.

![FocusFlow Screenshot](https://d2xsxph8kpxj0f.cloudfront.net/310519663140771997/nrNj8C9LJoShNEFPjt7DgA/focusflow-hero-bg-HvKcC8FoVgXEK4bwLTdb4A.webp)

## Features

- **Neon Pomodoro Timer** — SVG-based circular timer with glowing neon effects, tick marks, and phase-aware color shifts (cyan for focus, green for short breaks, magenta for long breaks)
- **Ambient Soundscapes** — Three curated ambient sound environments (Neon Rain, Deep Space, Bio Forest) with volume control, powered by Howler.js
- **Session Journaling** — Log what you worked on after each session with mood tracking (1–5 scale), activity tags (Coding, Writing, Reading, Creative, Exercise, Deep Work), and quick notes
- **Productivity Analytics** — Real-time stats dashboard with daily goal progress, streak counter, weekly focus chart (Recharts), and session history
- **Customizable Settings** — Adjust focus/break durations, sessions before long break, daily goal, and auto-start preferences
- **Matrix Rain Background** — Subtle animated canvas background with falling characters for that authentic cyberpunk atmosphere
- **Scanline Overlay** — CRT-style scanline effect across the entire interface
- **Local Storage Persistence** — All sessions, settings, and stats persist in the browser with no account required

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling with custom OKLCH color system |
| **Framer Motion** | Animations and micro-interactions |
| **Recharts** | Weekly focus bar chart |
| **Howler.js** | Ambient sound playback |
| **Vite 7** | Build tool and dev server |
| **shadcn/ui** | Base component library (Radix UI) |
| **Lucide React** | Icon system |

## Design Philosophy

FocusFlow follows a **"Neon Terminal"** design system inspired by cyberpunk command centers:

- **Color Palette**: Deep space black background with electric cyan (`oklch(0.85 0.18 192)`) as primary, hot magenta (`oklch(0.65 0.28 5)`) as accent, acid green (`oklch(0.82 0.26 145)`) for success states
- **Typography**: JetBrains Mono for data/timer displays, Space Grotesk for headings and navigation
- **Layout**: Asymmetric — large timer on the left, stacked control panels on the right
- **Interactions**: Spring-based animations, neon glow effects, breathing pulses on active elements

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/AnthonyHinojosa77/focusflow.git
cd focusflow

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
client/
  src/
    components/
      AmbiencePanel.tsx    # Ambient sound selector with volume control
      MatrixRain.tsx       # Canvas-based matrix rain background
      NeonTimer.tsx        # SVG circular timer with neon glow
      SessionHistory.tsx   # Terminal-style session log
      SessionLog.tsx       # Post-session journaling dialog
      SettingsPanel.tsx     # Timer configuration modal
      StatsPanel.tsx       # Productivity analytics dashboard
      TimerControls.tsx    # Play/Pause/Reset/Skip controls
    hooks/
      useTimer.ts          # Pomodoro timer state machine
      useAmbience.ts       # Howler.js sound management
    lib/
      store.ts             # localStorage-backed data layer
      ambience.ts          # Ambient sound definitions
    pages/
      Home.tsx             # Main application page
    App.tsx                # Root component with routing
    index.css              # Global styles and neon utilities
```

## Usage Guide

1. **Start a Focus Session** — Click the play button to begin a 25-minute focus session
2. **Choose a Soundscape** — Switch to the "Sounds" tab and select an ambient environment
3. **Complete & Journal** — When the timer ends, log what you worked on, rate your mood, and add tags
4. **Track Progress** — View your daily goal, streak, and weekly chart in the "Stats" tab
5. **Review History** — Check past sessions in the "Log" tab
6. **Customize** — Click the gear icon to adjust timer durations and daily goals

## Customization Ideas

- **Add more soundscapes** — Drop new entries into `client/src/lib/ambience.ts` with any audio URL
- **Custom color themes** — Modify the OKLCH values in `client/src/index.css` to create new color schemes
- **Keyboard shortcuts** — Add `useEffect` listeners in `Home.tsx` for Space (play/pause), R (reset), etc.
- **Export data** — Add a JSON export button in the settings panel to back up session history
- **Browser notifications** — Use the Notifications API to alert when a session completes
- **Spotify integration** — Replace the ambient sounds with Spotify playlist embeds

## License

MIT

---

Built with ⚡ by [Manus AI](https://manus.im) for Anthony Hinojosa
