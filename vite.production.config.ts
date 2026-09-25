import { resolve } from 'node:path';
import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        inertia(),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': resolve('resources/js'),
        },
    },
    build: {
        emptyOutDir: true,
        manifest: 'manifest.json',
        outDir: 'public/build',
        rollupOptions: {
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
        },
    },
});
