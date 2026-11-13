import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/cauldron/',
  plugins: [react()],
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
    alias: {
      'react-native': path.resolve(__dirname, './shared/web-stubs/react-native.ts'),
      'react-native-appodeal': path.resolve(__dirname, './shared/web-stubs/react-native-appodeal.tsx'),
      'react-native-iap': path.resolve(__dirname, './shared/web-stubs/react-native-iap.ts'),
      'react-native-google-mobile-ads': path.resolve(__dirname, './shared/web-stubs/react-native-google-mobile-ads.tsx'),
      '@notifee/react-native': path.resolve(__dirname, './shared/web-stubs/notifee.ts'),
      'react-native-version-check': path.resolve(__dirname, './shared/web-stubs/react-native-version-check.ts'),
      'react-native-webview': path.resolve(__dirname, './shared/web-stubs/react-native-webview.tsx'),
      '@react-native-community/datetimepicker': path.resolve(__dirname, './shared/web-stubs/datetimepicker.tsx'),
      'react-native-pager-view': path.resolve(__dirname, './shared/web-stubs/react-native-pager-view.tsx'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
