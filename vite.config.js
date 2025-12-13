import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [vue(),
      AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ],
    base: isProduction ? './' : '/',   // Use relative paths in production
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),   // Add alias for `@` pointing to `src`
      },
    },
    build: {
      outDir: 'dist',   // Output directory
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'src/main.js'),   // Entry file
        output: {
          assetFileNames: 'assets/[name][extname]',   // No hash for assets
          entryFileNames: 'assets/main.js',           // Fixed name for JS entry
          chunkFileNames: 'assets/[name].js',         // Fixed name for JS chunks
        },
      },
    },
    server: {
      port: 5174,
      strictPort: true,
      proxy: {
        '/wp-admin': 'http://localhost/giantwpsolutions',   // Adjust to your local WordPress setup
        '/wp-content': 'http://localhost/giantwpsolutions',
      },
    },
  };
});

