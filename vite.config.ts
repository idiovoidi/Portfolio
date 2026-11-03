import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path: '/' for Vercel, '/repo-name/' for GitHub Pages
  base: "/",
  plugins: [
    react({
      // Disable fast refresh in production to avoid eval
      babel: {
        compact: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "animation-vendor": ["framer-motion"],
          "form-vendor": ["react-hook-form"],
          "icons-vendor": ["react-icons"],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "react-hook-form",
      "react-icons",
    ],
  },
});
