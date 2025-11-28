import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Cambia este número al puerto que desees
    open: true, // Opcional: abre el navegador automáticamente
    // host: true, // Opcional: permite acceso desde otros dispositivos en la red
  },
})
