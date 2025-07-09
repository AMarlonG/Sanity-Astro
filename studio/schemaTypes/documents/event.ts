import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'

export const event = defineType({
  name: 'event',
  title: 'Arrangementer',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      default: true,
    },
    {
      name: 'image',
      title: 'Bilde',
    },
    {
      name: 'artists',
      title: 'Artister',
    },
    {
      name: 'timing',
      title: 'Tidspunkt & sted',
    },
    {
      name: 'button',
      title: 'Knapp',
    },
    {
      name: 'content',
      title: 'Innhold',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne dette arrangementet på nettsiden',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'genre',
      title: 'Sjanger',
      type: 'reference',
      to: [{type: 'genre'}],
      description: 'Velg sjanger for arrangementet',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'imageComponent',
      description: 'Hovedbilde for arrangementet med alt-tekst og kreditering',
      group: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Spillested',
      type: 'reference',
      to: [{type: 'venue'}],
      description: 'Velg spillestedet for arrangementet',
      group: 'timing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artists',
      title: 'Artister',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artist'}],
        },
      ],
      description: 'Velg artister som skal opptre på arrangementet',
      group: 'artists',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'eventDate',
      title: 'Arrangementsdato',
      type: 'reference',
      to: [{type: 'eventDate'}],
      description: 'Velg fra de konfigurerte arrangementsdatoene',
      group: 'timing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventTime',
      title: 'Klokkeslett',
      type: 'string',
      description: 'Klokkeslett for arrangementet (f.eks. "20:00" eller "20:00-22:00")',
      group: 'timing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Knappetekst',
      type: 'string',
      description: 'Teksten som vises på knappen',
      group: 'button',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Knapp-URL',
      type: 'url',
      description: 'URL-en knappen skal lede til (f.eks. billettkjøp)',
      group: 'button',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'buttonOpenInNewTab',
      title: 'Åpne knapp i ny fane',
      type: 'boolean',
      description: 'Åpner knapp-lenken i en ny fane',
      group: 'button',
      initialValue: true,
    }),
    defineField({
      name: 'content',
      title: 'Arrangementsinnhold',
      type: 'pageBuilder',
      description: 'Bygg arrangement-siden med komponenter og innhold',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue.title',
      artists: 'artist',
      media: 'image.image',
      eventDate: 'eventDate.title',
      eventDateDate: 'eventDate.date',
      eventTime: 'eventTime',
      genre: 'genre.title',
    },
    prepare(selection) {
      const {title, venue, artists, media, eventDate, eventDateDate, eventTime, genre} = selection
      const artistNames = artists?.map((artist: any) => artist.name).join(', ') || 'Ingen artister'
      const dateString = eventDateDate
        ? new Date(eventDateDate).toLocaleDateString('nb-NO')
        : 'Ingen dato'
      const timeString = eventTime || 'Ingen klokkeslett'
      const dateLabel = eventDate ? `${eventDate} (${dateString})` : dateString
      const genreLabel = genre ? ` • ${genre}` : ''
      return {
        title: title,
        subtitle: `${dateLabel} ${timeString} • ${venue ? venue + ' • ' : ''}${artistNames}${genreLabel}`,
        media: media,
      }
    },
  },
})
