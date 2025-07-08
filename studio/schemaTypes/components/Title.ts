import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

// HTML escape utility function
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const titleType = defineType({
  name: 'title',
  title: 'Title',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'mainTitle',
      title: 'Main Title (H1)',
      type: 'string',
      description: 'The primary title of the document. This will be rendered as an H1 tag.',
      validation: (Rule) =>
        Rule.required().error('Main title is required for SEO and accessibility'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (H2)',
      type: 'string',
      description: 'Optional subtitle that will be rendered as an H2 tag below the main title.',
      validation: (Rule) =>
        Rule.max(200).warning('Subtitles should be concise for better readability'),
    }),
  ],
  preview: {
    select: {
      title: 'mainTitle',
      subtitle: 'subtitle',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `Subtitle: ${subtitle}` : 'No subtitle',
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
