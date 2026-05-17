import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only isolate external node dependencies
          if (!id.includes("node_modules")) return;

          // 1. Heavy Rich Text Editor Ecosystem (Isolated for Admin panel views)
          if (id.includes("@tiptap") || id.includes("prosemirror")) {
            return "editor";
          }

          // 2. Data Visualization & Analytics
          if (id.includes("recharts") || id.includes("d3")) {
            return "charts";
          }

          // 3. Bulky Layout UI, Motion Foundations, & Icon Suites
          if (
            id.includes("framer-motion") ||
            id.includes("lucide-react") ||
            id.includes("embla-carousel-react")
          ) {
            return "ui-vendor";
          }

          // 4. Standalone Cryptographic Utilities
          if (id.includes("crypto-js")) {
            return "crypto-utils";
          }

          // 5. Global Data Flow, Async Queries, & Network Management
          if (
            id.includes("@reduxjs") ||
            id.includes("react-redux") ||
            id.includes("@tanstack/react-query") ||
            id.includes("axios")
          ) {
            return "state-data";
          }

          // React core engine components, Radix primitives, and minor layout utilities
          // safely pass through here to let Rollup optimize their dependency tree natively.
        },
      },
    },
  },
});