import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import path from 'path'

const aliasConfig = {
  '@models': path.resolve(__dirname, 'src/shared/models'),
  '@utils': path.resolve(__dirname, 'src/shared/utils'),
  '@services': path.resolve(__dirname, 'src/backend/services'), 
  '@components': path.resolve(__dirname, 'src/frontend/components'),
  '@hooks': path.resolve(__dirname, 'src/frontend/hooks'),
  '@styles': path.resolve(__dirname, 'src/frontend/styles'),
  '@assets': path.resolve(__dirname, 'src/frontend/assets'),
  '@tabs': path.resolve(__dirname, 'src/frontend/tabs'),
  '@backend': path.resolve(__dirname, 'src/backend'),
  '@frontend': path.resolve(__dirname, 'src/frontend'),
  '@shared': path.resolve(__dirname, 'src/shared'),
}

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'src/backend/main.ts',
        vite: {
          build: {
            rolldownOptions: {
              external: ['@libsql/client', 'drizzle-orm'],
            }
          },
          resolve: { alias: aliasConfig } 
        }
      },
      preload: {
        input: 'src/backend/preload.ts',
        vite: {
          resolve: { alias: aliasConfig } 
        }
      },
    }),
  ],
  resolve: {
    alias: aliasConfig,
  },
})
