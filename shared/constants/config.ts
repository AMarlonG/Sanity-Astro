// Delt konfigurasjon for Sanity prosjektet
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID
  || process.env.PUBLIC_SANITY_PROJECT_ID
  || '';

const DATASET = process.env.SANITY_STUDIO_DATASET
  || process.env.PUBLIC_SANITY_DATASET
  || 'production';

export const SANITY_CONFIG = {
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
} as const;

export const SITE_CONFIG = {
  title: 'Sanity + Astro + HTMX',
  description: 'Moderne web-applikasjon med Sanity CMS og Astro frontend',
  url: process.env.SITE_URL || 'http://localhost:4321',
} as const;
