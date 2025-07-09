// Delt konfigurasjon for Sanity prosjektet
export const SANITY_CONFIG = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
} as const;

export const SITE_CONFIG = {
  title: 'Sanity + Astro + HTMX',
  description: 'Moderne web-applikasjon med Sanity CMS og Astro frontend',
  url: process.env.SITE_URL || 'http://localhost:4321',
} as const;
