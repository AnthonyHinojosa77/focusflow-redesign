/**
 * Ambient Soundscapes for FocusFlow
 * Design: Neon Terminal — each soundscape has a visual theme
 */
import rainImage from "@/assets/ambience-rain.webp";
import spaceImage from "@/assets/ambience-space.webp";
import forestImage from "@/assets/ambience-forest.webp";

export interface AmbienceOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  // Free ambient sound URLs from pixabay.com (royalty-free)
  url: string;
  image: string;
  color: string; // tailwind color class for the card accent
}

export const AMBIENCE_OPTIONS: AmbienceOption[] = [
  {
    id: "none",
    name: "Silence",
    icon: "🔇",
    description: "Pure focus, no distractions",
    url: "",
    image: "",
    color: "text-muted-foreground",
  },
  {
    id: "rain",
    name: "Neon Rain",
    icon: "🌧️",
    description: "Rain on city windows",
    url: "https://cdn.pixabay.com/audio/2024/11/04/audio_4956b4ece1.mp3",
    image: rainImage,
    color: "text-neon-cyan",
  },
  {
    id: "space",
    name: "Deep Space",
    icon: "🌌",
    description: "Cosmic ambient drone",
    url: "https://cdn.pixabay.com/audio/2024/09/10/audio_6e1833e1b2.mp3",
    image: spaceImage,
    color: "text-neon-magenta",
  },
  {
    id: "forest",
    name: "Bio Forest",
    icon: "🌿",
    description: "Enchanted night forest",
    url: "https://cdn.pixabay.com/audio/2022/08/31/audio_419263fc12.mp3",
    image: forestImage,
    color: "text-neon-green",
  },
];
