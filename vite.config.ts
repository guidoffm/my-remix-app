import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"; // <--- NEU
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), // <--- MUSS VOR REMIX STEHEN
    remix({
      future: {
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});