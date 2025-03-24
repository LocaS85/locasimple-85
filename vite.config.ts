
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Ensure HMR (Hot Module Replacement) works properly
      clientPort: 443, // Use SSL port for secure connections
      overlay: true, // Show errors as overlay
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Reduce chunk size for better performance on mobile
    chunkSizeWarningLimit: 1000,
  },
  // Use the override typescript configuration
  optimizeDeps: {
    force: true // Forces dependencies to be re-optimized when config changes
  }
}));
