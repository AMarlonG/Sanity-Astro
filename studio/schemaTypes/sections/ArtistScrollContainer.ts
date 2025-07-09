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
      name: 'cardStyle',
      title: 'Artist-kort stil',
      type: 'string',
      description: 'Velg stil for artist-kortene',
      options: {
        list: [
          {title: 'Standard kort', value: 'standard'},
          {title: 'Avrundede hjørner', value: 'rounded'},
          {title: 'Med skygge', value: 'shadowed'},
          {title: 'Minimalistisk', value: 'minimal'},
        ],
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'cardSize',
      title: 'Artist-kort størrelse',
      type: 'string',
      description: 'Velg størrelse for artist-kortene',
      options: {
        list: [
          {title: 'Liten (200px)', value: 'small'},
          {title: 'Medium (300px)', value: 'medium'},
          {title: 'Stor (400px)', value: 'large'},
          {title: 'Ekstra stor (500px)', value: 'xlarge'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'showScrollbar',
      title: 'Vis scrollbar',
      type: 'boolean',
      description: 'Om scrollbaren skal være synlig eller skjult',
      initialValue: false,
    }),
    defineField({
      name: 'gap',
      title: 'Mellomrom mellom artister',
      type: 'string',
      description: 'Velg mellomrom mellom artist-kortene',
      options: {
        list: [
          {title: 'Liten (8px)', value: 'small'},
          {title: 'Medium (16px)', value: 'medium'},
          {title: 'Stor (24px)', value: 'large'},
          {title: 'Ekstra stor (32px)', value: 'xlarge'},
        ],
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      cardStyle: 'cardStyle',
      cardSize: 'cardSize',
    },
    prepare({title, items, cardStyle, cardSize}) {
      const itemCount = items?.length || 0
      return {
        title: title || 'Artist Scroll Container',
        subtitle: `${itemCount} artister • ${cardStyle} • ${cardSize}`,
        media: DocumentIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra artist scroll container data
export function generateArtistScrollHtml(data: {
  title?: string
  items?: any[]
  cardStyle?: string
  cardSize?: string
  showScrollbar?: boolean
  gap?: string
}): string {
  if (!data.items || data.items.length === 0) {
    return ''
  }

  const containerClass = 'artist-scroll-container'
  const scrollbarClass = data.showScrollbar ? '' : 'hide-scrollbar'
  const cardStyleClass = data.cardStyle ? `card-style-${data.cardStyle}` : 'card-style-standard'
  const cardSizeClass = data.cardSize ? `card-size-${data.cardSize}` : 'card-size-medium'
  const gapClass = data.gap ? `gap-${data.gap}` : 'gap-medium'

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
    <div class="${containerClass} ${scrollbarClass} ${cardStyleClass} ${cardSizeClass} ${gapClass}">
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
