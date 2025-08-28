import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Esta es la configuración clave que soluciona el error con "@"
      "@": path.resolve(__dirname, "./src"),
    },
  },
})