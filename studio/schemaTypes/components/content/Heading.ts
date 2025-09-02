import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

// HTML escape utility function (imported from Title.ts)
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const heading = defineType({
  name: 'headingComponent',
  title: 'Overskrifter',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'level',
      title: 'Nivå',
      type: 'string',
      description: 'Velg overskriftens nivå (H2-H6)',
      options: {
        list: [
          {title: 'H2 - Underskrift', value: 'h2'},
          {title: 'H3 - Mindre underskrift', value: 'h3'},
          {title: 'H4 - Liten overskrift', value: 'h4'},
          {title: 'H5 - Mindre overskrift', value: 'h5'},
          {title: 'H6 - Minste overskrift', value: 'h6'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Overskriftstekst',
      type: 'string',
      description: 'Teksten som skal vises som overskrift',
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: 'id',
      title: 'Anker-ID (valgfritt)',
      type: 'slug',
      description:
        'Unik ID for overskriften som brukes for direkte lenker til denne seksjonen. Trykk "Generer" for å lage automatisk fra overskriftsteksten.',
      options: {
        source: (doc: any, options: any) => {
          // Hent tekst fra parent objekt
          const parent = options.parent
          return parent?.text || ''
        },
        maxLength: 96,
        isUnique: () => true,
      },
    }),
  ],
  preview: {
    select: {
      level: 'level',
      text: 'text',
      id: 'id',
    },
    prepare({level, text, id}) {
      const displayLevel = level ? level.toUpperCase() : 'H?'
      const displayText = text || 'Ingen overskriftstekst'
      const displayId = id?.current ? `Anker: #${id.current}` : ''

      return {
        title: `${displayLevel}: ${displayText}`,
        subtitle: displayId,
        media: BlockContentIcon,
      }
    },
  },
})

// Function to generate HTML from heading data
export function generateHeadingHtml(data: {
  level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
  id?: {current: string}
}): string {
  if (!data.text || !data.level) {
    return ''
  }

  const escapedText = escapeHtml(data.text)
  const escapedId = data.id?.current ? escapeHtml(data.id.current) : ''

  // Build attributes
  const attributes: string[] = []

  if (escapedId) {
    attributes.push(`id="${escapedId}"`)
  }

  const attributesString = attributes.length > 0 ? ` ${attributes.join(' ')}` : ''

  return `<${data.level}${attributesString}>${escapedText}</${data.level}>`
}

// Utility function to generate ID from text if not provided
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .substring(0, 50) // Limit length
    .trim()
}

// Validation function to check heading hierarchy
export function validateHeadingHierarchy(
  headings: Array<{level: string; text: string}>,
  hasTitleH2?: boolean,
): {isValid: boolean; errors: string[]} {
  const errors: string[] = []

  // Check if H2 exists when title has H2
  if (hasTitleH2) {
    const hasH2InHeadings = headings.some((h) => h.level === 'h2')
    if (hasH2InHeadings) {
      errors.push('H2 should only be used in the Title component, not in Headings')
    }
  }

  // Check for proper hierarchy (H2 -> H3 -> H4 -> H5 -> H6)
  let previousLevel = 2 // Start with H2 since H1 is not available in Headings
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.level.slice(1))

    if (currentLevel - previousLevel > 1) {
      errors.push(
        `Heading hierarchy error at "${heading.text}": Cannot skip from H${previousLevel} to H${currentLevel}`,
      )
    }

    previousLevel = currentLevel
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
