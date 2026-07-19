# ⚡ FocusFlow — Deep Work Command Center

A cyberpunk-themed Pomodoro timer and productivity companion built with React, TypeScript, and Tailwind CSS. FocusFlow combines a neon-glow timer with ambient soundscapes, session journaling, and productivity analytics — all wrapped in a retro-futuristic terminal aesthetic.

**Live demo:** https://anthonyhinojosa77.github.io/focusflow-redesign/

## Features

- **Neon Pomodoro Timer** — SVG-based circular timer with glowing neon effects, tick marks, and phase-aware color shifts (cyan for focus, green for short breaks, magenta for long breaks)
- **Ambient Soundscapes** — Three curated ambient sound environments (Neon Rain, Deep Space, Bio Forest) streamed from Pixabay with volume control, powered by Howler.js. If a stream fails to load, a small non-blocking notice appears and the rest of the UI keeps working
- **Session Journaling** — Log what you worked on after each session with mood tracking (1–5 scale), activity tags (Coding, Writing, Reading, Creative, Exercise, Deep Work), and quick notes
- **Productivity Analytics** — Real-time stats dashboard with daily goal progress, streak counter, weekly focus chart (Recharts), and session history
- **Customizable Settings** — Adjust focus/break durations, sessions before long break, daily goal, and auto-start preferences
- **Keyboard Shortcuts** — `Space` to play/pause and `R` to reset (ignored while typing or while a control is focused), with an in-app shortcuts hint in the header
- **Browser Notifications** — Optional Web Notification when a focus session ends (permission requested on first use; degrades silently if denied)
- **Matrix Rain Background** — Subtle animated canvas background with falling characters for that authentic cyberpunk atmosphere. Respects `prefers-reduced-motion` (renders a static dim frame), throttles to ~24fps, and pauses while the tab is hidden to keep CPU usage low
- **Scanline Overlay** — CRT-style scanline effect across the entire interface
- **Local Storage Persistence** — All sessions, settings, and stats persist in the browser. No account, no backend — the app is 100% client-side

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool and dev server |
| **Tailwind CSS 4** | Styling with custom OKLCH color system |
| **wouter** | Lightweight client-side routing |
| **Framer Motion** | Animations and micro-interactions |
| **Recharts** | Weekly focus bar chart |
| **Howler.js** | Ambient sound playback |
| **shadcn/ui** | Base component library (Radix UI) |
| **Lucide React** | Icon system |
| **pnpm** | Package manager |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+ (`corepack enable` if needed)

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

The app is served at `http://localhost:3000/focusflow-redesign/` (the dev server uses the same base path as the production GitHub Pages deployment).

### Build for Production

```bash
# Type-check
pnpm check

# Build static assets into dist/public
pnpm build

# Preview the production build locally
pnpm preview
```

`pnpm build` emits a fully static site into `dist/public`, including a `404.html` copy of `index.html` so deep links work on GitHub Pages.

## Deployment

The site deploys automatically to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main` (or manually via *Actions → Deploy → Run workflow*). The workflow installs dependencies with pnpm, builds the static site, and publishes `dist/public` using the official GitHub Pages actions.

One-time setup in the repository: **Settings → Pages → Source: GitHub Actions**.

## Project Structure

```
client/
  index.html             # HTML entry (fonts, root div)
  src/
    assets/              # Self-hosted imagery (hero background, soundscape art)
    components/
      AmbiencePanel.tsx  # Ambient sound selector with volume control
      MatrixRain.tsx     # Canvas-based matrix rain background
      NeonTimer.tsx      # SVG circular timer with neon glow
      SessionHistory.tsx # Terminal-style session log
      SessionLog.tsx     # Post-session journaling dialog
      SettingsPanel.tsx  # Timer configuration modal
      StatsPanel.tsx     # Productivity analytics dashboard
      TimerControls.tsx  # Play/Pause/Reset/Skip controls
      ui/                # shadcn/ui base components
    hooks/
      useTimer.ts        # Pomodoro timer state machine
      useAmbience.ts     # Howler.js sound management (with graceful failure)
    lib/
      store.ts           # localStorage-backed data layer
      ambience.ts        # Ambient sound definitions
    pages/
      Home.tsx           # Main application page
      NotFound.tsx       # 404 page
    App.tsx              # Root component with routing (base-aware)
    index.css            # Global styles and neon utilities
```

## Usage Guide

1. **Start a Focus Session** — Click the play button to begin a 25-minute focus session
2. **Choose a Soundscape** — Switch to the "Sounds" tab and select an ambient environment
3. **Complete & Journal** — When the timer ends, log what you worked on, rate your mood, and add tags
4. **Track Progress** — View your daily goal, streak, and weekly chart in the "Stats" tab
5. **Review History** — Check past sessions in the "Log" tab
6. **Customize** — Click the gear icon to adjust timer durations and daily goals

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start / pause / resume the timer |
| `R` | Reset the current phase |

Shortcuts are ignored while typing in an input or textarea and while a button or other control has focus. A hint is also available via the keyboard icon in the header.

## Design Philosophy

FocusFlow follows a **"Neon Terminal"** design system inspired by cyberpunk command centers:

- **Color Palette**: Deep space black background with electric cyan (`oklch(0.85 0.18 192)`) as primary, hot magenta (`oklch(0.65 0.28 5)`) as accent, acid green (`oklch(0.82 0.26 145)`) for success states
- **Typography**: JetBrains Mono for data/timer displays, Space Grotesk for headings and navigation
- **Layout**: Asymmetric — large timer on the left, stacked control panels on the right; collapses to a single column on mobile
- **Interactions**: Spring-based animations, neon glow effects, breathing pulses on active elements

## License

MIT
