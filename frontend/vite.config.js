import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend en puerto 3000, backend en 4000
    open: true, // Opcional: abre el navegador automáticamente
    // host: true, // Opcional: permite acceso desde otros dispositivos en la red
  },
})
