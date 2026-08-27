// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { sites } from '@openai/sites-vite-plugin';

// https://astro.build/config
export default defineConfig({
  site: 'https://gamescalculators.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [preact(), mdx()],
  vite: {
    plugins: [sites(), tailwindcss()]
  }
});
