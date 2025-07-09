// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import htmx from 'astro-htmx';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321',
  base: '/',
  trailingSlash: 'never',

  build: {
    assets: 'assets',
  },

  vite: {
    ssr: {
      external: ['@sanity/client'],
    },
  },

  integrations: [
    sanity({
      projectId: 'i952bgb1',
      dataset: 'production',
      useCdn: false, // for statiske builds
    }),
    htmx(),
  ],
});
