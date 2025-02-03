import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth/token': {
        target: 'https://api.twitter.com/2/oauth2/token',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth\/token/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/api/twitter': {
        target: 'https://api.twitter.com/2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twitter/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
    cors: true,
  },
  define: {
    'process.env': {},
  },
});
