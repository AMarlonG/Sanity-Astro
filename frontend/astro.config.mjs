// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

import sanity from '@sanity/astro';
import htmx from 'astro-htmx';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: '/',
  trailingSlash: 'never',

  // Enable built-in prefetch
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport'
  },

  // Enhanced security configuration for 2025
  experimental: {
    // Disable CSP for Visual Editing development
    // csp: true,
  },

  // Output configuration for server rendering
  output: 'server', // Server-rendered for API routes and dynamic content
  adapter: node({
    mode: 'standalone',
  }),

  // Modern image optimization configuration
  image: {
    // Configure image optimization service
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // 16384 x 16384 max resolution
      }
    },
    // Configure remote image domains for Sanity CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**'
      }
    ]
  },

  build: {
    assets: 'assets',
    // Enhanced build optimization for images
    assetsInlineLimit: 0, // Don't inline any assets, use CDN
    // Bundle optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'sanity': ['@sanity/client', '@sanity/image-url'],
          'htmx': ['htmx.org']
        }
      }
    }
  },

  vite: {
    ssr: {
      external: ['@sanity/client'],
    },
    // Enhanced image processing during build
    optimizeDeps: {
      include: ['@sanity/image-url'],
      exclude: ['@sanity/client'] // Don't bundle in client-side
    },
    build: {
      // Optimize chunk sizes
      chunkSizeWarningLimit: 1000,
      // Enable minification
      minify: 'esbuild',
      // Tree shaking
      rollupOptions: {
        treeshake: true
      }
    },
    define: {
      // Cache headers for optimized images
      __IMAGE_CACHE_HEADERS__: JSON.stringify({
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Netlify-CDN-Cache-Control': 'public, max-age=31536000'
      })
    }
  },

  integrations: [
    react(),
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'i952bgb1',
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
      useCdn: false, // for statiske builds
      apiVersion: '2025-01-01', // Use latest API version
      stega: {
        studioUrl: 'http://localhost:3333'
      },
    }),
    htmx(),
  ],
});
