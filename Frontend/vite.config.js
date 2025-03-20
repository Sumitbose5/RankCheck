import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allows access from network
    port: 5173, // You can change the port if needed
    strictPort: true, // Ensures Vite uses this exact port
    allowedHosts: 'all' // Allows any domain/IP
  }
});


