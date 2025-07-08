import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {nbNOLocale} from '@sanity/locale-nb-no'
import {schemaTypes} from './schemaTypes'
import {structure} from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'studio',

  projectId: 'i952bgb1',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), nbNOLocale()],

  schema: {
    types: schemaTypes,
  },
})
