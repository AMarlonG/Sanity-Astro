import {defineField, defineType} from 'sanity'
import {CalendarIcon, ImageIcon, UsersIcon, ClockIcon, LinkIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'
import {eventTimeOptions} from '../../lib/timeUtils'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'
import {multilingualImageFields, imageFieldsets, imageGroup} from '../shared/imageFields'
import {seoFields, seoGroup} from '../objects/seoFields'
import {componentValidation, crossFieldValidation} from '../shared/validation'
import type {EventData, ValidationRule, MultilingualDocument} from '../shared/types'

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
    imageGroup,
    {
      name: 'scheduling',
      title: 'Publisering',
      icon: CogIcon,
    },
    seoGroup,
  ],
  fieldsets: [
    ...imageFieldsets,
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
      name: 'ticketUrl',
      title: 'Billett-URL',
      type: 'url',
      description: 'Link til billettsystem for dette arrangementet (valgfritt)',
      group: 'basic',
      validation: componentValidation.url
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
      options: {
        sort: [{field: 'date', direction: 'asc'}],
      },
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
    ...multilingualImageFields('image'),
    // NORSK INNHOLD
    defineField({
      name: 'title_no',
      title: 'Navn på arrangement (norsk)',
      type: 'string',
      description: 'Arrangementsnavn på norsk',
      validation: componentValidation.title,
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
      validation: componentValidation.slug,
    }),
    defineField({
      name: 'excerpt_no',
      title: 'Ingress (norsk)',
      type: 'text',
      description: 'Kort beskrivelse av arrangementet på norsk (vises i lister)',
      group: 'no',
      rows: 2,
      validation: componentValidation.description,
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
      validation: componentValidation.slug,
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      description: 'Short description of the event in English (shown in lists)',
      group: 'en',
      rows: 2,
      validation: componentValidation.description,
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
      validation: componentValidation.title,
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
          validation: crossFieldValidation.requiredWhen('publishingStatus', 'scheduled'),
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når dette arrangementet slutter å være synlig på nettsiden',
          fieldset: 'timing',
          validation: crossFieldValidation.requiredWhen('publishingStatus', 'scheduled'),
        },
      ],
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title_no: 'title_no',
      title_en: 'title_en',
      media: 'image',
      eventDate: 'eventDate.title',
      eventDateDate: 'eventDate.date',
      startTime: 'eventTime.startTime',
      _id: '_id',
    },
    prepare(selection) {
      const {title_no, title_en, media, eventDate, eventDateDate, startTime, _id} = selection

      const isPublished = _id && !_id.startsWith('drafts.')
      const statusText = isPublished ? 'Publisert' : 'Utkast'
      const title = title_no || title_en || 'Uten navn'

      // Date and time info
      const dateString = eventDateDate
        ? new Date(eventDateDate).toLocaleDateString('nb-NO')
        : null
      const dateLabel = eventDate && dateString ? `${eventDate} (${dateString})` : (dateString || 'Ingen dato')
      const timeText = startTime ? ` kl. ${startTime}` : ''
      const dateTimeText = `${dateLabel}${timeText}`

      // Language flags based on which languages have content
      const languageFlags = []
      if (title_no) languageFlags.push('🇳🇴')
      if (title_en) languageFlags.push('🇬🇧')
      const flagsText = languageFlags.length > 0 ? languageFlags.join(' ') + ' • ' : ''

      return {
        title: title,
        subtitle: `${dateTimeText}\n${flagsText}${statusText}`,
        media: media,
      }
    },
  },
})
