import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_APP_API_URL?.trim();

  if (command === 'serve' && !apiUrl) {
    throw new Error('Environment variable VITE_APP_API_URL is required');
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
