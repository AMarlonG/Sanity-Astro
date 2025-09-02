import {defineField} from 'sanity'
import {SearchIcon} from '@sanity/icons'

/**
 * Reusable SEO fields for documents
 */
export const seoFields = [
  defineField({
    name: 'seo',
    title: '🔍 SEO',
    type: 'object',
    group: 'seo',
    fields: [
      defineField({
        name: 'metaTitle',
        title: 'Meta tittel',
        type: 'string',
        description: 'Tittel for søkemotorer (50-60 tegn)',
        validation: (Rule) => Rule.max(60).warning('Bør være under 60 tegn for beste resultat'),
      }),
      defineField({
        name: 'metaDescription',
        title: 'Meta beskrivelse',
        type: 'text',
        rows: 3,
        description: 'Beskrivelse for søkemotorer (150-160 tegn)',
        validation: (Rule) => Rule.max(160).warning('Bør være under 160 tegn for beste resultat'),
      }),
      defineField({
        name: 'ogImage',
        title: 'Open Graph bilde',
        type: 'image',
        description: 'Bilde som vises når lenken deles på sosiale medier (1200x630px anbefalt)',
        options: {
          hotspot: true,
        },
      }),
      defineField({
        name: 'keywords',
        title: 'Nøkkelord',
        type: 'array',
        of: [{type: 'string'}],
        description: 'Legg til relevante søkeord',
        options: {
          layout: 'tags',
        },
      }),
      defineField({
        name: 'noIndex',
        title: 'Skjul fra søkemotorer',
        type: 'boolean',
        description: 'Forhindre at denne siden indekseres av søkemotorer',
        initialValue: false,
      }),
    ],
  }),
]

// Helper to add SEO group to document schemas
export const seoGroup = {
  name: 'seo',
  title: '🔍 SEO',
  icon: SearchIcon,
}