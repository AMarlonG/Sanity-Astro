import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const artistScrollContainer = defineType({
  name: 'artistScrollContainer',
  title: 'Artist Scroll Container',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Tittel for artist scroll-containeren (valgfritt)',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'items',
      title: 'Artister',
      type: 'array',
      description: 'Legg til mellom 2 og 8 artister som skal vises i horisontal scroll',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      validation: (Rule) => Rule.max(8).min(2),
    }),
    defineField({
      name: 'showScrollbar',
      title: 'Vis scrollbar',
      type: 'boolean',
      description: 'Om scrollbaren skal være synlig eller skjult',
      initialValue: false,
    }),
    defineField({
      name: 'cardFormat',
      title: 'Kortformat',
      type: 'string',
      description: 'Velg format for artist-kortene (bredde:høyde)',
      options: {
        list: [
          {title: 'Landskap (16:9)', value: '16:9'},
          {title: 'Portrett (4:5)', value: '4:5'},
        ],
      },
      initialValue: '16:9',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      cardFormat: 'cardFormat',
    },
    prepare({title, items, cardFormat}) {
      const itemCount = items?.length || 0
      return {
        title: 'Artister',
        subtitle: `${title || 'Scroll Container'} • ${itemCount} artister • ${cardFormat}`,
        media: DocumentIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra artist scroll container data
export function generateArtistScrollHtml(data: {
  title?: string
  items?: any[]
  showScrollbar?: boolean
  cardFormat?: string
}): string {
  if (!data.items || data.items.length === 0) {
    return ''
  }

  const containerClass = 'artist-scroll-container'
  const scrollbarClass = data.showScrollbar ? '' : 'hide-scrollbar'
  const cardFormatClass = data.cardFormat
    ? `card-format-${data.cardFormat.replace(':', '-')}`
    : 'card-format-16-9'

  const itemsHtml = data.items
    .map((artist) => {
      if (!artist) return ''

      const artistName = artist.name || ''
      const artistImage = artist.image?.asset?.url || ''
      const artistImageAlt = artist.image?.alt || artistName || ''
      const artistBio = artist.bio || ''
      const artistGenres = artist.genres?.map((genre: any) => genre.title).join(', ') || ''

      return `
        <div class="artist-item">
          <div class="artist-card">
            ${artistImage ? `<div class="artist-image"><img src="${artistImage}" alt="${escapeHtml(artistImageAlt)}" /></div>` : ''}
            <div class="artist-content">
              <h4 class="artist-name">${escapeHtml(artistName)}</h4>
              ${artistGenres ? `<div class="artist-genres">${escapeHtml(artistGenres)}</div>` : ''}
              ${artistBio ? `<div class="artist-bio">${escapeHtml(artistBio.substring(0, 100))}${artistBio.length > 100 ? '...' : ''}</div>` : ''}
            </div>
          </div>
        </div>
      `
    })
    .join('')

  const titleHtml = data.title
    ? `<h3 class="artist-scroll-title">${escapeHtml(data.title)}</h3>`
    : ''

  return `
    <div class="${containerClass} ${scrollbarClass} ${cardFormatClass}">
      ${titleHtml}
      <div class="artist-scroll-wrapper">
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
