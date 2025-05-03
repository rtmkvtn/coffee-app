import react from '@vitejs/plugin-react'

import * as child from 'child_process'
import path from 'path'
import { AliasOptions, defineConfig } from 'vite'
import vitePluginSvgr from 'vite-plugin-svgr'

const commitHash = child.execSync('git rev-parse --short HEAD').toString()

// https://vite.dev/config/
export default defineConfig({
  envDir: './env',
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
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@pages': path.resolve(__dirname, './src/pages'),
    } as AliasOptions,
  },
})
