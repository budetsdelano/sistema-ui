import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },


  // Конфигурация CSS/SCSS
  css: {
    devSourcemap: mode === 'development',
  },

  // Конфигурация сборки
  build: mode === 'production' ? {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    target: 'es2020',
    sourcemap: false,
    reportCompressedSize: false,

    // Оптимизация для CSS
    cssCodeSplit: true,
    cssMinify: true,

    // Настройки выходных файлов
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || ''

          // CSS и SCSS - хешируем для кэширования
          if (/\.(css|scss)$/.test(name)) {
            return 'assets/css/[name]-[hash][extname]'
          }

          // Графические ассеты - БЕЗ хеширования для SEO
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) {
            return 'assets/img/[name][extname]'
          }

          // Шрифты - без хеширования
          if (/\.(woff|woff2|ttf|eot)$/.test(name)) {
            return 'assets/fonts/[name][extname]'
          }

          // Остальные ассеты
          return 'assets/[name]-[hash][extname]'
        },

        // JS файлы хешируем для кэширования
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',

        // Разделение vendor кода
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
        }
      }
    },
  } : {
    sourcemap: true,
    minify: false
  }
}))
