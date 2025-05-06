import react from '@vitejs/plugin-react'

import * as child from 'child_process'
import path from 'path'
import { AliasOptions, defineConfig } from 'vite'
import vitePluginSvgr from 'vite-plugin-svgr'

const commitHash = child.execSync('git rev-parse --short HEAD').toString()

// https://vite.dev/config/
export default defineConfig({
  envDir: './env',
  server: {
    allowedHosts: true,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    COMMIT_HASH: JSON.stringify(commitHash),
  },
  plugins: [
    react(),
    vitePluginSvgr({
      include: '**/*.svg?react',
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@views': path.resolve(__dirname, './src/views'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@context': path.resolve(__dirname, './src/context'),
      '@constants': path.resolve(__dirname, './src/constants'),
    } as AliasOptions,
  },
})
