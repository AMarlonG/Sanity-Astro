import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

/**
 * Modern SEO object type with fallback logic
 * Uses page content as fallback if SEO fields are empty
 */
export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO-tittel',
      type: 'string',
      description: 'Vises i søkemotorer og som fane-tittel. Hvis tom, brukes sidens hovedtittel.',
      validation: (Rule) => Rule.max(60).warning('Hold deg under 60 tegn for beste resultat'),
    }),
    defineField({
      name: 'description',
      title: 'SEO-beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Kort sammendrag for søkemotorer og sosiale medier. Hvis tom, brukes sidens ingress.',
      validation: (Rule) => Rule.max(160).warning('Hold deg under 160 tegn for beste resultat'),
    }),
    defineField({
      name: 'noIndex',
      title: 'Skjul fra søkemotorer',
      type: 'boolean',
      description: 'Forhindre at denne siden indekseres av søkemotorer',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      noIndex: 'noIndex',
    },
    prepare({title, description, noIndex}) {
      const status = noIndex ? '🚫 Skjult fra søkemotorer' : '✅ Synlig for søkemotorer'
      const content = title || description ? `${title || 'Ingen tittel'} • ${description || 'Ingen beskrivelse'}` : 'Bruker fallback fra sideinnhold'

      return {
        title: 'SEO-innstillinger',
        subtitle: `${content} • ${status} • Hovedbilde brukes for deling`,
        media: SearchIcon,
      }
    },
  },
})

/**
 * Reusable SEO field for documents
 */
export const seoFields = [
  defineField({
    name: 'seo',
    title: 'SEO-innstillinger',
    type: 'seo',
    group: 'seo',
  }),
]

// Helper to add SEO group to document schemas
export const seoGroup = {
  name: 'seo',
  title: 'SEO',
  icon: SearchIcon,
}