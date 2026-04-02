// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    vite: {
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname,
        },
    },
    plugins: [tailwindcss()],
    },
    output: 'server',
    adapter: vercel(),
});