
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: mode === 'production' ? {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    } : {},
    open: mode === 'development'
  },
  plugins: [
    react({
      devTarget: 'es2022',
      plugins: [],
      jsxImportSource: undefined,
      tsDecorators: false,
      ...(mode === 'development' && {
        dev: {
          reactRefresh: true,
        }
      })
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "components": path.resolve(__dirname, "./src/components"),
      "utils": path.resolve(__dirname, "./src/utils")
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    chunkSizeWarningLimit: 1500,
    target: 'esnext',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: ['console.debug']
      },
      format: {
        comments: false
      }
    },
    reportCompressedSize: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    force: mode === 'development'
  },
  ...(mode === 'production' && {
    base: '/',
    manifest: true
  })
}));
