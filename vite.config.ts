import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, UserConfigExport } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite configuration with improved type safety and comments
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  // Helper to safely stringify env vars
  const envString = (key: string) => JSON.stringify(env[key] || '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': envString('GEMINI_API_KEY'),
      'import.meta.env.VITE_GEMINI_API_KEY': envString('VITE_GEMINI_API_KEY'),
      'process.env.OPENAI_API_KEY': envString('OPENAI_API_KEY'),
      'process.env.ANTHROPIC_API_KEY': envString('ANTHROPIC_API_KEY'),
      'process.env.HF_API_KEY': envString('HF_API_KEY'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-ai': ['@google/genai', 'openai', 'groq-sdk', '@anthropic-ai/sdk'],
            'vendor-ui': ['lucide-react', 'motion', '@base-ui/react'],
            'vendor-lib': ['jspdf', 'jspdf-autotable', 'axios', 'react-markdown', 'remark-gfm', 'react-router-dom'],
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // Add more Vite options here as needed
  } satisfies UserConfigExport;
});
