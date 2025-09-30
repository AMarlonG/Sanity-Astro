import {defineField, defineType} from 'sanity'
import {UserIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'

export const artist = defineType({
  name: 'artist',
  title: 'Artister',
  type: 'document',
  icon: UserIcon,
  orderings: [
    { title: 'Navn A–Å', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Nylig opprettet', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
  groups: [
    {
      name: 'basic',
      title: 'Felles innhold',
      icon: CogIcon,
      default: true,
    },
    {
      name: 'no',
      title: '🇳🇴 Norsk',
      icon: ComposeIcon,
    },
    {
      name: 'en',
      title: '🇬🇧 English',
      icon: ComposeIcon,
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
  ],
  fields: [
    // BASE (shared content)
    defineField({
      name: 'name',
      title: 'Navn på artist',
      type: 'string',
      description: 'Artistnavn (samme på alle språk)',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-vennlig versjon av artistnavn (brukes på alle språk)',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (!value?.current && context.document?.name) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
      group: 'basic',
    }),

    // NORSK INNHOLD
    defineField({
      name: 'excerpt_no',
      title: 'Ingress (norsk)',
      type: 'text',
      description: 'Kort beskrivelse på norsk (vises i lister)',
      rows: 2,
      validation: (Rule) => Rule.max(100),
      group: 'no',
    }),
    defineField({
      name: 'instrument_no',
      title: 'Instrument (norsk)',
      type: 'string',
      description: 'Instrumentbeskrivelse på norsk',
      validation: (Rule) => Rule.required(),
      group: 'no',
    }),
    defineField({
      name: 'content_no',
      title: 'Artistinnhold (norsk)',
      type: 'pageBuilderWithoutTitle',
      description: 'Bygg norsk artist-side med komponenter og innhold',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      description: 'Short description in English (shown in lists)',
      rows: 2,
      validation: (Rule) => Rule.max(100),
      group: 'en',
    }),
    defineField({
      name: 'instrument_en',
      title: 'Instrument (English)',
      type: 'string',
      description: 'Instrument description in English',
      group: 'en',
    }),
    defineField({
      name: 'content_en',
      title: 'Artist content (English)',
      type: 'pageBuilderWithoutTitle',
      description: 'Build English artist page with components and content',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
    }),
    defineField({
      name: 'image',
      title: 'Hovedbilde',
      type: 'image',
      description: 'Hovedbilde for artisten - brukes på artistsiden og når siden deles på sosiale medier',
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
          description: 'Når denne artisten blir synlig på nettsiden',
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
          description: 'Når denne artisten slutter å være synlig på nettsiden',
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
    defineField({
      name: 'events',
      title: 'Arrangementer',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'event'}],
        }
      ],
      description: 'Velg arrangementer som denne artisten opptrer på',
      group: 'basic',
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      instrument_no: 'instrument_no',
      instrument_en: 'instrument_en',
      publishingStatus: 'publishingStatus',
      scheduledStart: 'scheduledPeriod.startDate',
      scheduledEnd: 'scheduledPeriod.endDate',
      media: 'image',
      hasNorwegian: 'excerpt_no',
      hasEnglish: 'excerpt_en',
      _id: '_id',
    },
    prepare({name, instrument_no, instrument_en, publishingStatus, scheduledStart, scheduledEnd, media, hasNorwegian, hasEnglish, _id}) {
      // Publication status logic
      const isPublished = _id && !_id.startsWith('drafts.')
      let statusText = isPublished ? 'Publisert' : 'Utkast';

      if (publishingStatus === 'scheduled' && scheduledStart && scheduledEnd) {
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

      // Language status
      const languages: string[] = [];
      if (hasNorwegian) languages.push('🇳🇴');
      if (hasEnglish) languages.push('🇬🇧');
      const langStatus = languages.length > 0 ? languages.join(' ') : '⚠️';

      const instrument = instrument_no || instrument_en || 'Ukjent instrument';

      return {
        title: name,
        subtitle: `${instrument} • ${statusText} • ${langStatus}`,
        media: media || UserIcon,
      };
    },
  },
})
