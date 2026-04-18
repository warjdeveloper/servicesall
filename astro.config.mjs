// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';
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
    adapter: netlify(),
});