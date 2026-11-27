import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

const rootDir = import.meta.dirname;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
          }
        },
      },
    ],
    define: {
      __DEV__: JSON.stringify(mode !== 'production'),
      'process.env.EXPO_PUBLIC_API_URL': JSON.stringify(
        env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
      ),
      'process.env.EXPO_PUBLIC_USE_MOCK_DATA': JSON.stringify(
        env.EXPO_PUBLIC_USE_MOCK_DATA || 'true'
      ),
    },
    resolve: {
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ],
      alias: {
        'react-native': path.resolve(rootDir, 'src/services/web/reactNativeShim.ts'),
        '@react-native/assets-registry/registry': path.resolve(
          rootDir,
          'src/services/web/assetsRegistryShim.ts'
        ),
        '@': path.resolve(rootDir, '.'),
      },
    },
    optimizeDeps: {
      rolldownOptions: {
        resolve: {
          extensions: [
            '.web.tsx',
            '.web.ts',
            '.web.jsx',
            '.web.js',
            '.mjs',
            '.js',
            '.mts',
            '.ts',
            '.jsx',
            '.tsx',
            '.json',
          ],
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
