import {defineField, defineType} from 'sanity'
import {CalendarIcon, ImageIcon, UsersIcon, ClockIcon, LinkIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'
import {eventTimeOptions} from '../../lib/timeUtils'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'

export const event = defineType({
  name: 'event',
  title: 'Arrangementer',
  type: 'document',
  icon: CalendarIcon,

  orderings: [
    { title: 'Navn A–Å', name: 'nameAsc', by: [{ field: 'title_no', direction: 'asc' }] },
    { title: 'Nylig opprettet', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
  groups: [
    {
      name: 'no',
      title: '🇳🇴 Norsk',
      icon: ComposeIcon,
      default: true,
    },
    {
      name: 'en',
      title: '🇬🇧 English',
      icon: ComposeIcon,
    },
    {
      name: 'basic',
      title: 'Felles innhold',
      icon: CogIcon,
    },
    {
      name: 'scheduling',
      title: 'Publisering',
      icon: CogIcon,
    },
  ],
  fieldsets: [
    {
      name: 'altText',
      title: 'Alt-tekst',
      options: {columns: 2},
    },
    {
      name: 'imageCredit',
      title: 'Kreditering',
      options: {columns: 2},
    },
    {
      name: 'imageCaption',
      title: 'Bildetekst',
      options: {columns: 2},
    },
  ],
  fields: [
    // BASE (shared content)
    defineField({
      name: 'artist',
      title: 'Artister',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artist'}],
        }
      ],
      description: 'Velg artister som opptrer på arrangementet',
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
      group: 'basic',
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
          name: 'times',
          options: {columns: 2},
        },
      ],
      fields: [
        {
          name: 'startTime',
          title: 'Starttidspunkt',
          type: 'string',
          fieldset: 'times',
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
          fieldset: 'times',
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
      name: 'image',
      title: 'Hovedbilde',
      type: 'image',
      description: 'Hovedbilde for arrangementet - brukes på arrangementssiden og når siden deles på sosiale medier',
      group: 'basic',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'imageCredit_no',
      title: 'Kreditering (norsk)',
      type: 'string',
      description: 'Hvem som har tatt eller eier bildet på norsk (f.eks. "Foto: John Doe")',
      group: 'basic',
      fieldset: 'imageCredit',
    }),
    defineField({
      name: 'imageCredit_en',
      title: 'Kreditering (English)',
      type: 'string',
      description: 'Who took or owns the image in English (e.g. "Photo: John Doe")',
      group: 'basic',
      fieldset: 'imageCredit',
    }),
    defineField({
      name: 'imageAlt_no',
      title: 'Alt-tekst (norsk)',
      type: 'string',
      description: 'Beskriv bildet for tilgjengelighet på norsk',
      group: 'basic',
      fieldset: 'altText',
    }),
    defineField({
      name: 'imageAlt_en',
      title: 'Alt-tekst (English)',
      type: 'string',
      description: 'Describe the image for accessibility in English',
      group: 'basic',
      fieldset: 'altText',
    }),
    defineField({
      name: 'imageCaption_no',
      title: 'Bildetekst (norsk)',
      type: 'string',
      description: 'Valgfri tekst som kan vises med bildet på norsk',
      group: 'basic',
      fieldset: 'imageCaption',
    }),
    defineField({
      name: 'imageCaption_en',
      title: 'Bildetekst (English)',
      type: 'string',
      description: 'Optional text that can be shown with the image in English',
      group: 'basic',
      fieldset: 'imageCaption',
    }),

    // NORSK INNHOLD
    defineField({
      name: 'title_no',
      title: 'Navn på arrangement (norsk)',
      type: 'string',
      description: 'Arrangementsnavn på norsk',
      validation: (Rule) => Rule.required(),
      group: 'no',
    }),
    defineField({
      name: 'slug_no',
      title: 'URL (norsk)',
      type: 'slug',
      description: 'URL-vennlig versjon av norsk arrangementsnavn',
      group: 'no',
      options: {
        source: 'title_no',
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (!value?.current && context.document?.title_no) {
          return 'Trykk generer for å lage norsk URL'
        }
        return true
      }),
    }),
    defineField({
      name: 'excerpt_no',
      title: 'Ingress (norsk)',
      type: 'text',
      description: 'Kort beskrivelse av arrangementet på norsk (vises i lister)',
      group: 'no',
      rows: 2,
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'content_no',
      title: 'Arrangementsinnhold (norsk)',
      type: 'pageBuilderWithoutTitle',
      description: 'Bygg norsk arrangement-side med komponenter og innhold (arrangementsnavn er allerede H1)',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'title_en',
      title: 'Event name (English)',
      type: 'string',
      description: 'Event name in English',
      group: 'en',
    }),
    defineField({
      name: 'slug_en',
      title: 'URL (English)',
      type: 'slug',
      description: 'URL-friendly version of English event name',
      group: 'en',
      options: {
        source: 'title_en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (!value?.current && context.document?.title_en) {
          return 'Click generate to create English URL'
        }
        return true
      }),
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      description: 'Short description of the event in English (shown in lists)',
      group: 'en',
      rows: 2,
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'content_en',
      title: 'Event content (English)',
      type: 'pageBuilderWithoutTitle',
      description: 'Build English event page with components and content (event name is already H1)',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
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
      title_no: 'title_no',
      title_en: 'title_en',
      media: 'image',
      _id: '_id',
    },
    prepare(selection) {
      const {title_no, title_en, media, _id} = selection

      const isPublished = _id && !_id.startsWith('drafts.')
      const statusText = isPublished ? 'Publisert' : 'Utkast'
      const title = title_no || title_en || 'Uten navn'

      // Language flags based on which languages have content
      const languageFlags = []
      if (title_no) languageFlags.push('🇳🇴')
      if (title_en) languageFlags.push('🇬🇧')
      const flagsText = languageFlags.length > 0 ? languageFlags.join(' ') + ' • ' : ''

      return {
        title: title,
        subtitle: `${flagsText}${statusText}`,
        media: media,
      }
    },
  },
})
