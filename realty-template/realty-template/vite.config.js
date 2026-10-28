import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ 
  plugins: [react()],
  server: {
    allowedHosts: [
      'corticolous-admissibly-joline.ngrok-free.dev'
    ]
  }
})
