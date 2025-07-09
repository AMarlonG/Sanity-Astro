import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventScrollContainer = defineType({
  name: 'eventScrollContainer',
  title: 'Event Scroll Container',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Tittel for event scroll-containeren (valgfritt)',
      validation: (Rule) => Rule.max(100),
    }),
        defineField({
      name: 'events',
      title: 'Arrangementer',
      type: 'array',
      description: 'Legg til mellom 2 og 8 arrangementer som skal vises i horisontal scroll',
              of: [{type: 'reference', to: [{type: 'event'}]}],
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
      name: 'showDate',
      title: 'Vis dato',
      type: 'boolean',
      description: 'Om datoen skal vises på event-kortene',
      initialValue: true,
    }),
    defineField({
      name: 'showTime',
      title: 'Vis klokkeslett',
      type: 'boolean',
      description: 'Om klokkeslettet skal vises på event-kortene',
      initialValue: true,
    }),
    defineField({
      name: 'showVenue',
      title: 'Vis spillested',
      type: 'boolean',
      description: 'Om spillestedet skal vises på event-kortene',
      initialValue: true,
    }),
    defineField({
      name: 'showArtists',
      title: 'Vis artister',
      type: 'boolean',
      description: 'Om artistene skal vises på event-kortene',
      initialValue: true,
    }),
    defineField({
      name: 'sortBy',
      title: 'Sorter etter',
      type: 'string',
      description: 'Hvordan arrangementene skal sorteres',
      options: {
        list: [
          {title: 'Dato (tidligst først)', value: 'date-asc'},
          {title: 'Dato (senest først)', value: 'date-desc'},
          {title: 'Alfabetisk (tittel)', value: 'title-asc'},
          {title: 'Manuell rekkefølge', value: 'manual'},
        ],
      },
      initialValue: 'date-asc',
    }),
    defineField({
      name: 'cardFormat',
      title: 'Kortformat',
      type: 'string',
      description: 'Velg format for event-kortene (bredde:høyde)',
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
      events: 'events',
      cardFormat: 'cardFormat',
    },
    prepare({title, events, cardFormat}) {
      const eventCount = events?.length || 0
      return {
        title: title || 'Event Scroll Container',
        subtitle: `${eventCount} arrangementer • ${cardFormat}`,
        media: CalendarIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra event scroll container data
export function generateEventScrollHtml(data: {
  title?: string
  events?: any[]
  showScrollbar?: boolean
  showDate?: boolean
  showTime?: boolean
  showVenue?: boolean
  showArtists?: boolean
  sortBy?: string
  cardFormat?: string
}): string {
  if (!data.events || data.events.length === 0) {
    return ''
  }

  const containerClass = 'event-scroll-container'
  const scrollbarClass = data.showScrollbar ? '' : 'hide-scrollbar'
  const cardFormatClass = data.cardFormat
    ? `card-format-${data.cardFormat.replace(':', '-')}`
    : 'card-format-16-9'

  // Sorter arrangementer basert på valgt sortering
  let sortedEvents = [...data.events]
  switch (data.sortBy) {
    case 'date-asc':
      sortedEvents.sort((a, b) => {
        const dateA = a.eventDate?.date ? new Date(a.eventDate.date) : new Date(0)
        const dateB = b.eventDate?.date ? new Date(b.eventDate.date) : new Date(0)
        return dateA.getTime() - dateB.getTime()
      })
      break
    case 'date-desc':
      sortedEvents.sort((a, b) => {
        const dateA = a.eventDate?.date ? new Date(a.eventDate.date) : new Date(0)
        const dateB = b.eventDate?.date ? new Date(b.eventDate.date) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      break
    case 'title-asc':
      sortedEvents.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'manual':
    default:
      // Behold manuell rekkefølge
      break
  }

  const eventsHtml = sortedEvents
    .map((event) => {
      if (!event) return ''

      const eventDate = event.eventDate?.date ? new Date(event.eventDate.date) : null
      const dateString = eventDate ? eventDate.toLocaleDateString('nb-NO') : ''
      const timeString = event.eventTime || ''
      const venueName = event.venue?.title || ''
      const artistNames = event.artists?.map((artist: any) => artist.name).join(', ') || ''

      const dateHtml =
        data.showDate && dateString ? `<div class="event-date">${escapeHtml(dateString)}</div>` : ''
      const timeHtml =
        data.showTime && timeString ? `<div class="event-time">${escapeHtml(timeString)}</div>` : ''
      const venueHtml =
        data.showVenue && venueName ? `<div class="event-venue">${escapeHtml(venueName)}</div>` : ''
      const artistsHtml =
        data.showArtists && artistNames
          ? `<div class="event-artists">${escapeHtml(artistNames)}</div>`
          : ''

      const imageUrl = event.image?.asset?.url || ''
      const imageAlt = event.image?.alt || event.title || ''

      return `
        <div class="event-item">
          <div class="event-card">
            ${imageUrl ? `<div class="event-image"><img src="${imageUrl}" alt="${escapeHtml(imageAlt)}" /></div>` : ''}
            <div class="event-content">
              <h4 class="event-title">${escapeHtml(event.title || '')}</h4>
              ${dateHtml}
              ${timeHtml}
              ${venueHtml}
              ${artistsHtml}
              ${event.buttonText ? `<a href="${event.buttonUrl || '#'}" class="event-button" ${event.buttonOpenInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(event.buttonText)}</a>` : ''}
            </div>
          </div>
        </div>
      `
    })
    .join('')

  const titleHtml = data.title
    ? `<h3 class="event-scroll-title">${escapeHtml(data.title)}</h3>`
    : ''

  return `
    <div class="${containerClass} ${scrollbarClass} ${cardFormatClass}">
      ${titleHtml}
      <div class="event-scroll-wrapper">
        ${eventsHtml}
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
