import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function pageEntries(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            return pageEntries(path);
        }

        return entry.name.endsWith('.tsx') ? [path.replaceAll('\\', '/')] : [];
    });
}

export default defineConfig({
    base: '/build/',
    plugins: [
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
    ],
    build: {
        emptyOutDir: true,
        manifest: 'manifest.json',
        outDir: 'public/build',
        rollupOptions: {
            input: ['resources/css/app.css', 'resources/js/app.tsx', ...pageEntries('resources/js/pages')],
        },
    },
});
