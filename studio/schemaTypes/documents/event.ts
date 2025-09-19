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
      title: 'Arrangementinfo',
      icon: CalendarIcon,
      default: true,
    },
    {
      name: 'image',
      title: 'Hovedbilde',
      icon: ImageIcon,
    },
    {
      name: 'content',
      title: 'Innhold',
      icon: ComposeIcon,
    },
    {
      name: 'scheduling',
      title: 'Publisering',
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Navn på arrangement',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis brukeren prøver å publisere uten tittel
        if (!value && context.document?.publishingStatus === 'published') {
          return 'Navn på arrangement bør fylles ut før publisering'
        }
        return true
      }),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'Trykk generer for å lage URL',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis tittel finnes men slug mangler
        if (!value?.current && context.document?.title) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av arrangementet (vises i lister)',
      group: 'basic',
      rows: 2,
      validation: (Rule) => Rule.warning().max(100).custom((value, context) => {
        if (!value && context.document?.publishingStatus === 'published') {
          return 'Ingress bør fylles ut før publisering'
        }
        return true
      }),
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
      name: 'composers',
      title: 'Komponister',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'composer'}],
        }
      ],
      description: 'Velg komponister som har skrevet musikken som spilles på arrangementet',
      group: 'content',
    }),
    defineField({
      name: 'venue',
      title: 'Spillested',
      type: 'reference',
      to: [{type: 'venue'}],
      description: 'Velg spillestedet for arrangementet',
      group: 'basic',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Spillested må velges'
        }
        return true
      }),
    }),
    defineField({
      name: 'eventDate',
      title: 'Dato',
      type: 'reference',
      to: [{type: 'eventDate'}],
      description: 'Velg fra de konfigurerte festivaldatoene',
      group: 'basic',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Dato må velges'
        }
        return true
      }),
    }),
    defineField({
      name: 'eventTime',
      title: 'Klokkeslett',
      type: 'object',
      group: 'basic',
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
          validation: (Rule) => Rule.warning().custom((value, context) => {
            if (!value && context.document?.publishingStatus === 'published') {
              return 'Starttidspunkt bør fylles ut før publisering'
            }
            return true
          }),
        },
        {
          name: 'endTime',
          title: 'Sluttidspunkt',
          type: 'string',
          fieldset: 'timing',
          options: {
            list: eventTimeOptions,
          },
          validation: (Rule) => Rule.warning().custom((value, context) => {
            if (!value && context.document?.publishingStatus === 'published') {
              return 'Sluttidspunkt bør fylles ut før publisering'
            }
            return true
          }),
        },
      ],
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if ((!value?.startTime || !value?.endTime) && context.document?.publishingStatus === 'published') {
          return 'Klokkeslett bør fylles ut før publisering'
        }
        return true
      }),
    }),
    defineField({
      name: 'content',
      title: 'Arrangementsinnhold',
      type: 'pageBuilderWithoutTitle',
      description: 'Bygg arrangement-siden med komponenter og innhold (arrangementsnavn er allerede H1)',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Hovedbilde',
      type: 'image',
      description: 'Hovedbilde for arrangementet - brukes på arrangementssiden og når siden deles på sosiale medier',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Hovedbilde bør lastes opp'
        }
        return true
      }),
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'imageCredit',
      title: 'Kreditering',
      type: 'string',
      description: 'Hvem som har tatt eller eier bildet (f.eks. "Foto: John Doe" eller "Kilde: Unsplash")',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (context.document?.image && !value) {
          return 'Kreditering bør fylles ut når bilde er lastet opp'
        }
        return true
      }),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beskriv bildet for tilgjengelighet og SEO',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (context.document?.image && !value) {
          return 'Alt-tekst bør fylles ut når bilde er lastet opp'
        }
        return true
      }),
    }),
    defineField({
      name: 'imageCaption',
      title: 'Bildetekst',
      type: 'string',
      description: 'Valgfri tekst som kan vises med bildet',
      group: 'image',
    }),
    defineField({
      name: 'publishingStatus',
      title: 'Publiseringsstatus',
      type: 'string',
      options: {
        list: [
          { title: 'Synlig på nett umiddelbart', value: 'published' },
          { title: 'Lagre uten å bli synlig på nett', value: 'draft' },
          { title: 'Planlegg periode', value: 'scheduled' }
        ],
        layout: 'radio'
      },
      initialValue: 'published',
      validation: (Rule) => Rule.required(),
      group: 'scheduling',
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.publishingStatus !== 'scheduled',
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
          validation: (Rule) => Rule.required().custom((value, context) => {
            const status = context.document?.publishingStatus
            if (status === 'scheduled' && !value) {
              return 'Startdato må velges for planlagt periode'
            }
            if (status !== 'scheduled') {
              return true
            }
            return true
          }),
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når dette arrangementet slutter å være synlig på nettsiden',
          fieldset: 'timing',
          validation: (Rule) => Rule.required().custom((value, context) => {
            const status = context.document?.publishingStatus
            if (status === 'scheduled' && !value) {
              return 'Sluttdato må velges for planlagt periode'
            }
            if (status !== 'scheduled') {
              return true
            }
            return true
          }),
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
      publishingStatus: 'publishingStatus',
      scheduledStart: 'scheduledPeriod.startDate',
      scheduledEnd: 'scheduledPeriod.endDate',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const {title, venue, artists, media, eventDate, eventDateDate, startTime, endTime, genre, publishingStatus, scheduledStart, scheduledEnd, isFeatured} = selection
      
      // Status indicator logic
      let statusText = 'Utkast';
      
      if (publishingStatus === 'published') {
        statusText = 'Publisert';
      } else if (publishingStatus === 'scheduled' && scheduledStart && scheduledEnd) {
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
