import {defineField, defineType} from 'sanity'
import {AddCommentIcon} from '@sanity/icons'

// HTML escape utility function (imported from Title.ts)
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const quoteComponent = defineType({
  name: 'quoteComponent',
  title: 'Sitater',
  type: 'object',
  icon: AddCommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Sitat',
      type: 'text',
      description: 'Sitatet som skal vises',
      validation: (Rule) => Rule.required().min(1).max(500),
    }),
    defineField({
      name: 'author',
      title: 'Forfatter',
      type: 'string',
      description: 'Hvem som har sagt sitatet',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'source',
      title: 'Kilde',
      type: 'string',
      description: 'Hvor sitatet kommer fra (bok, artikkel, etc.)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'cite',
      title: 'Kilde-URL',
      type: 'url',
      description: 'Valgfri URL til den opprinnelige kilden.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).warning('Vennligst oppgi en gyldig URL'),
    }),
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'author',
      source: 'source',
    },
    prepare({title, subtitle, source}) {
      const displayTitle = title ? `${title.substring(0, 50)}...` : 'Ingen sitat'
      const displaySubtitle = subtitle
        ? `${subtitle}${source ? ` - ${source}` : ''}`
        : source || 'Ingen forfatter'

      return {
        title: displayTitle,
        subtitle: displaySubtitle,
        media: AddCommentIcon,
      }
    },
  },
})

// Function to generate HTML from quote data
export function generateQuoteHtml(data: {
  quote: string
  author?: string
  source?: string
  cite?: string
}): string {
  if (!data.quote) {
    return ''
  }

  const escapedQuote = escapeHtml(data.quote)
  const escapedAuthor = data.author ? escapeHtml(data.author) : ''
  const escapedSource = data.source ? escapeHtml(data.source) : ''
  const escapedCite = data.cite ? escapeHtml(data.cite) : ''

  let html = '<blockquote'

  if (escapedCite) {
    html += ` cite="${escapedCite}"`
  }

  html += '>'
  html += escapedQuote

  // Add attribution if author or source exists
  if (escapedAuthor || escapedSource) {
    html += '<cite>'
    if (escapedAuthor) {
      html += escapedAuthor
    }
    if (escapedAuthor && escapedSource) {
      html += ', '
    }
    if (escapedSource) {
      html += escapedSource
    }
    html += '</cite>'
  }

  html += '</blockquote>'
  return html
}
