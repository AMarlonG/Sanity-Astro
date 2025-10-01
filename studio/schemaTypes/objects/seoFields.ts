import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'
import {seoValidation} from '../shared/validation'
import type {SeoFieldsData, ValidationRule, SchemaGroup} from '../shared/types'

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
      validation: seoValidation.metaTitle,
    }),
    defineField({
      name: 'description',
      title: 'SEO-beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Kort sammendrag for søkemotorer og sosiale medier. Hvis tom, brukes sidens ingress.',
      validation: seoValidation.metaDescription,
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
export const seoGroup: SchemaGroup = {
  name: 'seo',
  title: 'SEO',
  icon: SearchIcon,
}

// Type-safe validation functions
export const seoValidationRules = {
  metaTitle: seoValidation.metaTitle as ValidationRule,
  metaDescription: seoValidation.metaDescription as ValidationRule,
} as const

// Utility function to validate SEO data
export function validateSeoData(data: SeoFieldsData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.title && data.title.length > 60) {
    errors.push('SEO-tittel bør være under 60 tegn for optimal visning i søkemotorer')
  }

  if (data.description && data.description.length > 160) {
    errors.push('SEO-beskrivelse bør være under 160 tegn for optimal visning i søkemotorer')
  }

  if (data.title && data.title.length < 10) {
    errors.push('SEO-tittel bør være minst 10 tegn lang')
  }

  if (data.description && data.description.length < 50) {
    errors.push('SEO-beskrivelse bør være minst 50 tegn lang')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Utility function to generate fallback SEO data
export function generateFallbackSeoData(pageData: {
  title?: string
  excerpt?: string
  image?: any
}): Partial<SeoFieldsData> {
  return {
    title: pageData.title,
    description: pageData.excerpt,
    image: pageData.image,
    noIndex: false,
  }
}