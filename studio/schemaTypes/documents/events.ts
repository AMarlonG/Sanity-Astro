import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventsType = defineType({
  name: 'events',
  title: 'Arrangementer',
  type: 'document',
  icon: CalendarIcon,
  fieldsets: [
    {
      name: 'button',
      title: 'Knapp',
      description: 'Konfigurer knappen for arrangementet',
    },
    {
      name: 'timing',
      title: 'Tidspunkt',
      description: 'Angi når arrangementet skal finne sted',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne dette arrangementet på nettsiden',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description: 'Bilde for arrangementet',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Spillested',
      type: 'reference',
      to: [{type: 'venues'}],
      description: 'Velg spillestedet for arrangementet',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artists',
      title: 'Artister',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artists'}],
        },
      ],
      description: 'Velg artister som skal opptre på arrangementet',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'eventDate',
      title: 'Arrangementsdato',
      type: 'reference',
      to: [{type: 'eventDates'}],
      description: 'Velg fra de konfigurerte arrangementsdatoene',
      fieldset: 'timing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventTime',
      title: 'Klokkeslett',
      type: 'string',
      description: 'Klokkeslett for arrangementet (f.eks. "20:00" eller "20:00-22:00")',
      fieldset: 'timing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Knappetekst',
      type: 'string',
      description: 'Teksten som vises på knappen',
      fieldset: 'button',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Knapp-URL',
      type: 'url',
      description: 'URL-en knappen skal lede til (f.eks. billettkjøp)',
      fieldset: 'button',
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
      fieldset: 'button',
      initialValue: true,
    }),
    defineField({
      name: 'content',
      title: 'Arrangementsinnhold',
      type: 'pageBuilder',
      description: 'Bygg arrangement-siden med komponenter og innhold',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue.title',
      artists: 'artists',
      media: 'image',
      eventDate: 'eventDate.title',
      eventDateDate: 'eventDate.date',
      eventTime: 'eventTime',
    },
    prepare(selection) {
      const {title, venue, artists, media, eventDate, eventDateDate, eventTime} = selection
      const artistNames = artists?.map((artist: any) => artist.name).join(', ') || 'Ingen artister'
      const dateString = eventDateDate ? new Date(eventDateDate).toLocaleDateString('nb-NO') : 'Ingen dato'
      const timeString = eventTime || 'Ingen klokkeslett'
      const dateLabel = eventDate ? `${eventDate} (${dateString})` : dateString
      return {
        title: title,
        subtitle: `${dateLabel} ${timeString} • ${venue ? venue + ' • ' : ''}${artistNames}`,
        media: media,
      }
    },
  },
})
