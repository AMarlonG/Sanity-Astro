import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {nbNOLocale} from '@sanity/locale-nb-no'
import {schemaTypes} from './schemaTypes'
import {structure} from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'studio',

  projectId: 'i952bgb1',
  dataset: 'production',

  plugins: [
    structureTool({structure}), 
    visionTool(), 
    nbNOLocale(),
    presentationTool({
      previewUrl: {
        origin: 'http://localhost:4321',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: {
          // Artist pages
          artist: {
            select: {
              title: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled artist',
                  href: `/artister/${doc?.slug}`,
                },
              ],
            }),
          },
          // Event pages  
          event: {
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled event',
                  href: `/program/${doc?.slug}`,
                },
              ],
            }),
          },
          // Article pages
          article: {
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled article',
                  href: `/artikler/${doc?.slug}`,
                },
              ],
            }),
          },
          // Homepage
          homepage: {
            select: {
              title: 'title',
              isDefault: 'isDefault',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Homepage',
                  href: '/',
                },
              ],
            }),
          },
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

})
