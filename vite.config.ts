
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',  // Utiliser 0.0.0.0 pour une meilleure accessibilité
    port: 3000,       // Utiliser le port 3000 comme suggéré
    strictPort: true, // Échouer si le port est déjà utilisé
    cors: true,       // Activer CORS pour toutes les origines
    hmr: {
      clientPort: 443,    // Port pour les connexions sécurisées
      host: 'localhost',  // Utiliser localhost au lieu de 127.0.0.1 pour compatibilité
      protocol: 'wss',    // Utiliser WebSocket sécurisé
      overlay: true,      // Afficher les erreurs en overlay
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
    // Réduire la taille des chunks pour de meilleures performances sur mobile
    chunkSizeWarningLimit: 1000,
  },
  // Optimisation des dépendances
  optimizeDeps: {
    force: true,  // Forcer la réoptimisation des dépendances lors des changements de config
    exclude: ['lovable-tagger'],  // Exclure les dépendances problématiques
  }
}));
