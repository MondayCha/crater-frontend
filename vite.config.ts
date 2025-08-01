/**
 * Copyright 2025 RAIDS Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { Plugin } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      cleanMSW(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_SERVER_PROXY_DOMAIN,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\//, env.VITE_SERVER_PROXY_PREFIX),
        },
      },
    },
  }
})

// This plugin cleans up the MSW mock service worker file after the build
// to prevent it from being served in production.
function cleanMSW(): Plugin {
  const PLUGIN_NAME = 'clean-msw'
  const MSW_FILENAME = 'mockServiceWorker.js'
  return {
    name: PLUGIN_NAME,
    writeBundle(outputOptions) {
      const outDir = outputOptions.dir

      if (outDir === undefined) return

      const mswDir = path.resolve(outDir, MSW_FILENAME)

      fs.unlink(mswDir, (err) => {
        if (err) {
          console.log(
            `\n[${PLUGIN_NAME}]: MSW public file, at '${mswDir}' could not be deleted`,
            err
          )
          return
        }
        console.log(`\n[${PLUGIN_NAME}]: MSW public file, at '${mswDir}' was deleted successfully`)
      })
    },
  }
}
