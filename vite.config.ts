import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    // Build multi-page: cada protocolo vira um HTML real em dist/protocolos/<slug>/index.html,
    // servido direto pelo nginx (index index.html) sem precisar de fallback de SPA.
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          rejuvenescimentoFacial: path.resolve(
            __dirname,
            'protocolos/rejuvenescimento-facial/index.html',
          ),
          emagrecimentoIntegrado: path.resolve(
            __dirname,
            'protocolos/emagrecimento-integrado/index.html',
          ),
        },
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
