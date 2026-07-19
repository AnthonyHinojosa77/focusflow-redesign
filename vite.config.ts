import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * Emits a 404.html identical to index.html into the build output.
 * GitHub Pages serves 404.html for unknown paths, which lets the SPA
 * handle deep links under the /focusflow-redesign/ project subpath.
 */
function spaFallback404(): Plugin {
  return {
    name: "spa-fallback-404",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist/public");
      const indexFile = path.join(outDir, "index.html");
      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, path.join(outDir, "404.html"));
      }
    },
  };
}

export default defineConfig({
  base: "/focusflow-redesign/",
  plugins: [react(), tailwindcss(), spaFallback404()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
