import {defineField, defineType} from 'sanity'
import {CalendarIcon, ImageIcon, UsersIcon, ClockIcon, LinkIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'
import {eventTimeOptions} from '../../lib/timeUtils'

export const event = defineType({
  name: 'event',
  title: 'Arrangementer',
  type: 'document',
  icon: CalendarIcon,

  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      icon: CalendarIcon,
      default: true,
    },
    {
      name: 'timing',
      title: 'Tidspunkt & sted',
      icon: ClockIcon,
    },
    {
      name: 'content',
      title: 'Innhold',
      icon: ComposeIcon,
    },
    {
      name: 'scheduling',
      title: 'Tidsstyring',
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Navn på arrangement',
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
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av arrangementet (vises i lister)',
      group: 'basic',
      rows: 2,
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'genre',
      title: 'Sjanger',
      type: 'reference',
      to: [{type: 'genre'}],
      description: 'Velg sjanger for arrangementet',
      group: 'basic',
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
      type: 'object',
      group: 'timing',
      fieldsets: [
        {
          name: 'timing',
          options: {columns: 2},
        },
      ],
      fields: [
        {
          name: 'startTime',
          title: 'Starttidspunkt',
          type: 'string',
          fieldset: 'timing',
          options: {
            list: eventTimeOptions,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'endTime',
          title: 'Sluttidspunkt',
          type: 'string',
          fieldset: 'timing',
          options: {
            list: eventTimeOptions,
          },
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Arrangementsinnhold',
      type: 'pageBuilder',
      description: 'Bygg arrangement-siden med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publisering',
      type: 'boolean',
      description: 'På: Synlig på nettsiden | Av: Skjult på nettsiden | Slett: Fjern helt (bruk slett-knappen)',
      group: 'scheduling',
      initialValue: false,
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.isPublished === true,
      group: 'scheduling',
      fieldsets: [
        {
          name: 'timing',
          options: {columns: 2},
        },
      ],
      fields: [
        {
          name: 'startDate',
          title: 'Startdato',
          type: 'datetime',
          description: 'Når dette arrangementet blir synlig på nettsiden',
          fieldset: 'timing',
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når dette arrangementet slutter å være synlig på nettsiden',
          fieldset: 'timing',
        },
      ],
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
      startTime: 'eventTime.startTime',
      endTime: 'eventTime.endTime',
      genre: 'genre.title',
      isPublished: 'isPublished',
      scheduledStart: 'scheduledPeriod.startDate',
      scheduledEnd: 'scheduledPeriod.endDate',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const {title, venue, artists, media, eventDate, eventDateDate, startTime, endTime, genre, isPublished, scheduledStart, scheduledEnd, isFeatured} = selection
      
      // Status indicator logic
      let statusText = 'Utkast';
      
      if (isPublished) {
        statusText = 'Publisert';
      } else if (scheduledStart && scheduledEnd) {
        const now = new Date();
        const start = new Date(scheduledStart);
        const end = new Date(scheduledEnd);
        
        if (now >= start && now <= end) {
          statusText = 'Live';
        } else if (now < start) {
          statusText = 'Venter';
        } else {
          statusText = 'Utløpt';
        }
      }
      
      const artistNames = artists?.map((artist: any) => artist.name).join(', ') || 'Ingen artister'
      const dateString = eventDateDate
        ? new Date(eventDateDate).toLocaleDateString('nb-NO')
        : 'Ingen dato'

      let timeString = ''
      if (startTime && endTime) {
        timeString = ` • ${startTime}-${endTime}`
      } else if (startTime) {
        timeString = ` • ${startTime}`
      }

      const dateLabel = eventDate ? `${eventDate} (${dateString})` : dateString
      const genreLabel = genre ? ` • ${genre}` : ''
      
      return {
        title: title,
        subtitle: `${dateLabel}${timeString} • ${venue || 'Ingen venue'} • ${artistNames}${genreLabel} • ${statusText}`,
        media: media,
      }
    },
  },
})
