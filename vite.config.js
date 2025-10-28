import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// For GitHub Pages project site deployment, set base to the repo name.
// Dev server ignores base; it only affects build/preview.
export default defineConfig({
  base: '/skyview-weather/',
  plugins: [react()],
})
