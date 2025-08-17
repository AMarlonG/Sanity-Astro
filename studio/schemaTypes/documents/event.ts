import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
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
    {
      name: 'scheduling',
      title: 'Tidsstyring',
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
      name: 'buttonText',
      title: 'Knappetekst',
      type: 'string',
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
    defineField({
      name: 'isPublished',
      title: 'Publisert',
      type: 'boolean',
      description: 'Dette arrangementet er synlig på nettsiden',
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
      let statusIcon = '⚫'; // Default: draft
      let statusText = 'Utkast';
      
      if (isPublished) {
        statusIcon = '🟢';
        statusText = 'Publisert';
      } else if (scheduledStart && scheduledEnd) {
        const now = new Date();
        const start = new Date(scheduledStart);
        const end = new Date(scheduledEnd);
        
        if (now >= start && now <= end) {
          statusIcon = '🟢';
          statusText = 'Live';
        } else if (now < start) {
          statusIcon = '🟡';
          statusText = 'Venter';
        } else {
          statusIcon = '🔴';
          statusText = 'Utløpt';
        }
      }
      
      // Featured indicator
      const featuredIcon = isFeatured ? '⭐ ' : '';
      
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
        title: `${statusIcon} ${featuredIcon}${title}`,
        subtitle: `${dateLabel}${timeString} • ${venue || 'Ingen venue'} • ${artistNames}${genreLabel} • ${statusText}`,
        media: media || '🎭',
      }
    },
  },
})
