import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Esto garantiza que funcione en local, en servidor y abriendo el archivo
  server: {
    port: 5500
  }
});
