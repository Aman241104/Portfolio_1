import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // ship the 3D machine lab alongside the site (Vite only builds index.html by default)
    rollupOptions: {
      input: {
        main: resolve(dirname(fileURLToPath(import.meta.url)), 'index.html'),
        lab: resolve(dirname(fileURLToPath(import.meta.url)), 'lab/machine.html'),
      },
    },
  },
  resolve: {
    alias: {
      '#components' : resolve(dirname(fileURLToPath(import.meta.url)),'components'),
      '#constants' : resolve(dirname(fileURLToPath(import.meta.url)),'constants'),
      '#content' : resolve(dirname(fileURLToPath(import.meta.url)),'content'),
      '#store' : resolve(dirname(fileURLToPath(import.meta.url)),'src/store'),
      '#hoc' : resolve(dirname(fileURLToPath(import.meta.url)),'src/hoc'),
      '#windows' : resolve(dirname(fileURLToPath(import.meta.url)),'src/windows'),
      '#mobile' : resolve(dirname(fileURLToPath(import.meta.url)),'src/mobile'),
      '#hooks' : resolve(dirname(fileURLToPath(import.meta.url)),'src/hooks'),
      '#worlds' : resolve(dirname(fileURLToPath(import.meta.url)),'src/worlds'),
      '#shell' : resolve(dirname(fileURLToPath(import.meta.url)),'src/shell'),
      '#machine' : resolve(dirname(fileURLToPath(import.meta.url)),'src/machine'),
    }
  }
});
