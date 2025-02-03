import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: 'react'
      })
    ],
    server: {
      proxy: {
        '/api/auth/token': {
          target: 'https://api.twitter.com/2/oauth2/token',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/auth\/token/, ''),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        },
        '/api/twitter': {
          target: 'https://api.twitter.com/2',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/twitter/, ''),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        },
      },
      cors: true,
      port: 5173,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    define: {
      // Inject environment variables
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_TWITTER_REDIRECT_URI': JSON.stringify(
        isDevelopment 
          ? env.VITE_TWITTER_REDIRECT_URI_DEV 
          : env.VITE_TWITTER_REDIRECT_URI_PROD
      ),
      'process.env.VITE_API_BASE_URL': JSON.stringify(
        isDevelopment 
          ? env.VITE_API_BASE_URL_DEV 
          : env.VITE_API_BASE_URL_PROD
      ),
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      esbuildOptions: {
        jsx: 'automatic',
      }
    },
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
    // Base URL based on environment
    base: isDevelopment ? '/' : 'https://twitter-cleaner-2.vercel.app',
  };
});
