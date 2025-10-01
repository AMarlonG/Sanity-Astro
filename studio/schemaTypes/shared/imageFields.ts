import {defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * Reusable multilingual image fields for documents
 * Provides consistent image handling across all document types
 */
export const multilingualImageFields = (fieldNamePrefix = 'image') => {
  const isRequired = fieldNamePrefix === 'featuredImage'
  const title = fieldNamePrefix === 'featuredImage' ? 'Bilde' : 'Hovedbilde'

  // Dynamic descriptions based on field type
  let description = 'Hovedbilde - brukes på siden og når siden deles på sosiale medier'
  if (fieldNamePrefix === 'featuredImage') {
    description = 'Last opp eller velg et bilde som representerer årets festival - brukes når sider deles på sosiale medier'
  } else if (fieldNamePrefix === 'image') {
    // Check context to determine if this is a page/article with optional image
    description = 'Hovedbilde - brukes på siden og når siden deles på sosiale medier'
  }

  return [
    defineField({
      name: fieldNamePrefix,
      title,
      type: 'image',
      description,
      group: 'image',
      validation: isRequired ? (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Festivalbilde må lastes opp'
        }
        return true
      }) : undefined,
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
  defineField({
    name: `${fieldNamePrefix}Credit_no`,
    title: 'Kreditering (norsk)',
    type: 'string',
    description: 'Hvem som har tatt eller eier bildet på norsk (f.eks. "Foto: John Doe")',
    group: 'image',
    fieldset: 'imageCredit',
  }),
  defineField({
    name: `${fieldNamePrefix}Credit_en`,
    title: 'Kreditering (English)',
    type: 'string',
    description: 'Who took or owns the image in English (e.g. "Photo: John Doe")',
    group: 'image',
    fieldset: 'imageCredit',
  }),
  defineField({
    name: `${fieldNamePrefix}Alt_no`,
    title: 'Alt-tekst (norsk)',
    type: 'string',
    description: 'Beskriv bildet for tilgjengelighet på norsk',
    group: 'image',
    fieldset: 'altText',
    validation: (Rule) => Rule.warning().custom((value, context) => {
      const imageExists = context.document?.[fieldNamePrefix]
      if (imageExists && !value) {
        return 'Alt-tekst anbefales når bilde er valgt'
      }
      return true
    }),
  }),
  defineField({
    name: `${fieldNamePrefix}Alt_en`,
    title: 'Alt-tekst (English)',
    type: 'string',
    description: 'Describe the image for accessibility in English',
    group: 'image',
    fieldset: 'altText',
    validation: (Rule) => Rule.warning().custom((value, context) => {
      const imageExists = context.document?.[fieldNamePrefix]
      if (imageExists && !value) {
        return 'Alt text recommended when image is selected'
      }
      return true
    }),
  }),
  ]
}

/**
 * Fieldsets for organizing image fields
 */
export const imageFieldsets = [
  {
    name: 'altText',
    title: 'Alt-tekst',
    options: {columns: 2},
  },
  {
    name: 'imageCredit',
    title: 'Kreditering',
    options: {columns: 2},
  },
]

/**
 * Standard image group for documents
 */
export const imageGroup = {
  name: 'image',
  title: 'Hovedbilde',
  icon: ImageIcon,
}

/**
 * Alternative image fields for cases where only one language is needed
 * or for special image types (like featured images)
 */
export const singleImageFields = (
  fieldNamePrefix = 'image',
  options: {
    title?: string
    description?: string
    language?: 'no' | 'en' | 'both'
    required?: boolean
  } = {}
) => {
  const {
    title = 'Bilde',
    description = 'Last opp et bilde',
    language = 'both',
    required = false
  } = options

  const fields = [
    defineField({
      name: fieldNamePrefix,
      title,
      type: 'image',
      description,
      group: 'image',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
      validation: required ? (Rule) => Rule.required().error('Bilde er påkrevd') : undefined,
    }),
  ]

  // Add credit fields based on language preference
  if (language === 'both' || language === 'no') {
    fields.push(
      defineField({
        name: `${fieldNamePrefix}Credit_no`,
        title: 'Kreditering (norsk)',
        type: 'string',
        description: 'Hvem som har tatt eller eier bildet på norsk',
        group: 'image',
        fieldset: 'imageCredit',
      })
    )
  }

  if (language === 'both' || language === 'en') {
    fields.push(
      defineField({
        name: `${fieldNamePrefix}Credit_en`,
        title: 'Kreditering (English)',
        type: 'string',
        description: 'Who took or owns the image in English',
        group: 'image',
        fieldset: 'imageCredit',
      })
    )
  }

  // Add alt text fields based on language preference
  if (language === 'both' || language === 'no') {
    fields.push(
      defineField({
        name: `${fieldNamePrefix}Alt_no`,
        title: 'Alt-tekst (norsk)',
        type: 'string',
        description: 'Beskriv bildet for tilgjengelighet på norsk',
        group: 'image',
        fieldset: 'altText',
        validation: (Rule) => Rule.warning().custom((value, context) => {
          const imageExists = context.document?.[fieldNamePrefix]
          if (imageExists && !value) {
            return 'Alt-tekst anbefales når bilde er valgt'
          }
          return true
        }),
      })
    )
  }

  if (language === 'both' || language === 'en') {
    fields.push(
      defineField({
        name: `${fieldNamePrefix}Alt_en`,
        title: 'Alt-tekst (English)',
        type: 'string',
        description: 'Describe the image for accessibility in English',
        group: 'image',
        fieldset: 'altText',
        validation: (Rule) => Rule.warning().custom((value, context) => {
          const imageExists = context.document?.[fieldNamePrefix]
          if (imageExists && !value) {
            return 'Alt text recommended when image is selected'
          }
          return true
        }),
      })
    )
  }

  return fields
}

/**
 * Helper function to get image field names for a given prefix
 */
export const getImageFieldNames = (fieldNamePrefix = 'image') => ({
  image: fieldNamePrefix,
  creditNo: `${fieldNamePrefix}Credit_no`,
  creditEn: `${fieldNamePrefix}Credit_en`,
  altNo: `${fieldNamePrefix}Alt_no`,
  altEn: `${fieldNamePrefix}Alt_en`,
})

/**
 * TypeScript interfaces for image data
 */
export interface MultilingualImageData {
  [key: string]: any // The image field (dynamic key)
  // Credit fields will have pattern: {prefix}Credit_no, {prefix}Credit_en
  // Alt fields will have pattern: {prefix}Alt_no, {prefix}Alt_en
}

export interface ImageFieldConfig {
  fieldNamePrefix?: string
  title?: string
  description?: string
  language?: 'no' | 'en' | 'both'
  required?: boolean
}