import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
export default defineConfig({
  // Plotly's CommonJS dependencies reference Node's global alias in browsers.
  define: { global: "globalThis" },
  plugins: [react(), tailwindcss(), cloudflare()],
  build: { chunkSizeWarningLimit: 1200 },
});
