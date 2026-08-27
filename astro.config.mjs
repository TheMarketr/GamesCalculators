// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gamescalculators.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [preact(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
