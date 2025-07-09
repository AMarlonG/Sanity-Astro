import {defineField, defineType} from 'sanity'
import {EllipsisHorizontalIcon} from '@sanity/icons'

export const contentScrollContainer = defineType({
  name: 'contentScrollContainer',
  title: 'Content Scroll Container',
  type: 'object',
  icon: EllipsisHorizontalIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Tittel for scroll-containeren (valgfritt)',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'items',
      title: 'Elementer',
      type: 'array',
      description: 'Legg til mellom 3 og 6 elementer som skal vises i horisontal scroll',
              of: [{type: 'imageComponent'}, {type: 'videoComponent'}, {type: 'quoteComponent'}],
      validation: (Rule) => Rule.max(6).min(3),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'Velg format for elementene i scroll-containeren (bredde:høyde)',
      options: {
        list: [
          {title: 'Portrett (4:5)', value: '4:5'},
          {title: 'Kvadrat (1:1)', value: '1:1'},
          {title: 'Landskap (16:9)', value: '16:9'},
          {title: 'Portrett (9:16)', value: '9:16'},
        ],
      },
      initialValue: '16:9',
    }),
    defineField({
      name: 'showScrollbar',
      title: 'Vis scrollbar',
      type: 'boolean',
      description: 'Om scrollbaren skal være synlig eller skjult',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      showScrollbar: 'showScrollbar',
    },
    prepare({title, items, showScrollbar}) {
      const itemCount = items?.length || 0
      const scrollbarStatus = showScrollbar ? 'med scrollbar' : 'uten scrollbar'
      return {
        title: title || 'Content Scroll Container',
        subtitle: `${itemCount} elementer • ${scrollbarStatus}`,
        media: EllipsisHorizontalIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra content scroll container data
export function generateContentScrollHtml(data: {
  title?: string
  items?: any[]
  showScrollbar?: boolean
  format?: string
}): string {
  if (!data.items || data.items.length === 0) {
    return ''
  }

  const containerClass = 'content-scroll-container'
  const scrollbarClass = data.showScrollbar ? '' : 'hide-scrollbar'
  const formatClass = data.format ? `format-${data.format.replace(':', '-')}` : 'format-16-9'

  // Importer funksjoner fra eksisterende komponenter
  const {generateImageHtml} = require('../components/Image')
  const {generateVideoHtml} = require('../components/Video')
  const {generateQuoteHtml} = require('../components/Quote')
  const {renderPortableText} = require('../components/PortableText')

  const itemsHtml = data.items
    .map((item) => {
      switch (item._type) {
        case 'imageComponent':
          return `<div class="scroll-item">${generateImageHtml(item)}</div>`
        case 'videoComponent':
          return `<div class="scroll-item">${generateVideoHtml(item)}</div>`
        case 'quoteComponent':
          return `<div class="scroll-item">${generateQuoteHtml(item)}</div>`
        case 'portableTextBlock':
          return `<div class="scroll-item">${renderPortableText(item.content)}</div>`
        default:
          return ''
      }
    })
    .join('')

  const titleHtml = data.title
    ? `<h3 class="scroll-container-title">${escapeHtml(data.title)}</h3>`
    : ''

  return `
    <div class="${containerClass} ${scrollbarClass} ${formatClass}">
      ${titleHtml}
      <div class="scroll-wrapper">
        ${itemsHtml}
      </div>
    </div>
  `
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
