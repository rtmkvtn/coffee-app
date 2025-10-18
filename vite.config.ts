import react from '@vitejs/plugin-react'

import * as child from 'child_process'
import fs from 'fs'
import path from 'path'
import { AliasOptions, defineConfig } from 'vite'
import vitePluginSvgr from 'vite-plugin-svgr'

const commitHash = child
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

const localesRoot = path.resolve(__dirname, './public/locales')
const versionedLocalesDir = path.resolve(localesRoot, `./${commitHash}`)

const ensureVersionedLocales = () => {
  if (!fs.existsSync(localesRoot)) {
    return
  }

  // Remove all old commit hash directories
  const allEntries = fs.readdirSync(localesRoot, { withFileTypes: true })
  allEntries
    .filter((entry) => entry.isDirectory() && /^[0-9a-f]{7}$/.test(entry.name))
    .forEach((entry) => {
      const oldCommitDir = path.join(localesRoot, entry.name)
      fs.rmSync(oldCommitDir, { recursive: true, force: true })
    })

  fs.mkdirSync(versionedLocalesDir, { recursive: true })

  const entries = fs.readdirSync(localesRoot, { withFileTypes: true })

  entries
    .filter((entry) => entry.isDirectory() && entry.name !== commitHash)
    .forEach((entry) => {
      const sourceDir = path.join(localesRoot, entry.name)
      const targetDir = path.join(versionedLocalesDir, entry.name)
      fs.mkdirSync(targetDir, { recursive: true })
      fs.cpSync(sourceDir, targetDir, { recursive: true })
    })
}

ensureVersionedLocales()

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
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@context': path.resolve(__dirname, './src/context'),
      '@models': path.resolve(__dirname, './src/models'),
      '@services': path.resolve(__dirname, './src/services'),
      '@constants': path.resolve(__dirname, './src/constants'),
    } as AliasOptions,
  },
})
