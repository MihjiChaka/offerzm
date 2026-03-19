import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Merge with process.env to ensure Netlify/CI variables are picked up
  const finalEnv = {
    ...env,
    ...process.env
  };

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(finalEnv.GEMINI_API_KEY || finalEnv.VITE_GEMINI_API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(finalEnv.GEMINI_API_KEY || finalEnv.VITE_GEMINI_API_KEY || ''),
      'process.env': JSON.stringify({
        GEMINI_API_KEY: finalEnv.GEMINI_API_KEY || finalEnv.VITE_GEMINI_API_KEY || '',
        NODE_ENV: mode
      }),
      'process': JSON.stringify({
        env: {
          GEMINI_API_KEY: finalEnv.GEMINI_API_KEY || finalEnv.VITE_GEMINI_API_KEY || '',
          NODE_ENV: mode
        }
      })
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
