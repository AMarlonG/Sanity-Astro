import {defineField, defineType} from 'sanity'
import {DocumentIcon, ImageIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'

export const article = defineType({
  name: 'article',
  title: 'Artikler',
  type: 'document',
  icon: DocumentIcon,
  orderings: [
    { title: 'Tittel A–Å', name: 'titleAsc', by: [{ field: 'title_no', direction: 'asc' }] },
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
      name: 'image',
      title: 'Hovedbilde',
      icon: ImageIcon,
    },
    {
      name: 'publishing',
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
    // NORSK INNHOLD
    defineField({
      name: 'title_no',
      title: 'Artikkeltittel (norsk)',
      type: 'string',
      description: 'Artikkeltittel på norsk',
      validation: (Rule) => Rule.required(),
      group: 'no',
    }),
    defineField({
      name: 'slug_no',
      title: 'URL (norsk)',
      type: 'slug',
      description: 'URL-vennlig versjon av norsk artikkeltittel',
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
      description: 'Kort beskrivelse av artikkelen på norsk (vises i lister)',
      group: 'no',
      rows: 2,
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'content_no',
      title: 'Artikkelinnhold (norsk)',
      type: 'pageBuilderWithoutTitle',
      description: 'Bygg norsk artikkel med komponenter og innhold (artikkeltittel er allerede H1)',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'title_en',
      title: 'Article title (English)',
      type: 'string',
      description: 'Article title in English',
      group: 'en',
    }),
    defineField({
      name: 'slug_en',
      title: 'URL (English)',
      type: 'slug',
      description: 'URL-friendly version of English article title',
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
      description: 'Short description of the article in English (shown in lists)',
      group: 'en',
      rows: 2,
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'content_en',
      title: 'Article content (English)',
      type: 'pageBuilderWithoutTitle',
      description: 'Build English article with components and content (article title is already H1)',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
    }),

    // HOVEDBILDE
    defineField({
      name: 'image',
      title: 'Hovedbilde (valgfritt)',
      type: 'image',
      description: 'Valgfritt hovedbilde for sosiale medier og hero-seksjon. Kan også legge inn bilder direkte i innholdet.',
      group: 'image',
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
      group: 'image',
      fieldset: 'imageCredit',
    }),
    defineField({
      name: 'imageCredit_en',
      title: 'Kreditering (English)',
      type: 'string',
      description: 'Who took or owns the image in English (e.g. "Photo: John Doe")',
      group: 'image',
      fieldset: 'imageCredit',
    }),
    defineField({
      name: 'imageAlt_no',
      title: 'Alt-tekst (norsk)',
      type: 'string',
      description: 'Beskriv bildet for tilgjengelighet på norsk',
      group: 'image',
      fieldset: 'altText',
    }),
    defineField({
      name: 'imageAlt_en',
      title: 'Alt-tekst (English)',
      type: 'string',
      description: 'Describe the image for accessibility in English',
      group: 'image',
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
      group: 'publishing',
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.publishingStatus !== 'scheduled',
      group: 'publishing',
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
          description: 'Når denne artikkelen blir synlig på nettsiden',
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
          description: 'Når denne artikkelen slutter å være synlig på nettsiden',
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
      excerpt_no: 'excerpt_no',
      excerpt_en: 'excerpt_en',
      publishingStatus: 'publishingStatus',
      scheduledStart: 'scheduledPeriod.startDate',
      scheduledEnd: 'scheduledPeriod.endDate',
      media: 'image',
      _id: '_id',
    },
    prepare({title_no, title_en, excerpt_no, excerpt_en, publishingStatus, scheduledStart, scheduledEnd, media, _id}) {
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
      if (title_no || excerpt_no) languages.push('🇳🇴');
      if (title_en || excerpt_en) languages.push('🇬🇧');
      const langStatus = languages.length > 0 ? languages.join(' ') : '⚠️';

      const title = title_no || title_en || 'Uten tittel';
      const excerpt = excerpt_no || excerpt_en || 'Ingen ingress';

      return {
        title: title,
        subtitle: `${excerpt} • ${statusText} • ${langStatus}`,
        media: media || DocumentIcon,
      };
    },
  },
})
