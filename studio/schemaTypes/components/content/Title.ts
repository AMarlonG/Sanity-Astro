import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {componentValidation, componentSpecificValidation} from '../../shared/validation'

// HTML escape utility function
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const title = defineType({
  name: 'title',
  title: 'Tittel',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'mainTitle',
      title: 'Hovedtittel (H1)',
      type: 'string',
      description: 'Hovedtittelen til dokumentet. Denne vises som en H1-tag.',
      validation: componentSpecificValidation.headingText,
    }),
    defineField({
      name: 'subtitle',
      title: 'Undertittel (H2)',
      type: 'string',
      description: 'Valgfri undertittel som vises som en H2-tag under hovedtittelen.',
      validation: componentSpecificValidation.headingText,
    }),
  ],
  preview: {
    select: {
      title: 'mainTitle',
      subtitle: 'subtitle',
    },
    prepare({title, subtitle}) {
      return {
        title: 'Tittel',
        subtitle: `${title || 'Uten tittel'}${subtitle ? ` • Undertittel: ${subtitle}` : ''}`,
        media: DocumentTextIcon,
      }
    },
  },
})

// Function to generate HTML from title data
export function generateTitleHtml(data: {mainTitle: string; subtitle?: string}): string {
  if (!data.mainTitle) {
    return ''
  }

  const escapedMainTitle = escapeHtml(data.mainTitle)
  const escapedSubtitle = data.subtitle ? escapeHtml(data.subtitle) : ''

  let html = `<h1>${escapedMainTitle}</h1>`

  if (escapedSubtitle) {
    html += `\n<h2>${escapedSubtitle}</h2>`
  }

  return html
}
