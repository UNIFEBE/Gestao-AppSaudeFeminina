import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7252',
        changeOrigin: true,
        secure: false, // ignora certificado autoassinado em dev
      },
    },
  },
})
