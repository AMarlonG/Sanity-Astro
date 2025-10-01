import {defineField, defineType} from 'sanity'
import {DocumentIcon, ComposeIcon, CogIcon, ImageIcon} from '@sanity/icons'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'
import {multilingualImageFields, imageFieldsets, imageGroup} from '../shared/imageFields'
import {seoFields, seoGroup} from '../objects/seoFields'

export const page = defineType({
  name: 'page',
  title: 'Faste sider',
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
    imageGroup,
    {
      name: 'publishing',
      title: 'Publisering',
      icon: CogIcon,
    },
    seoGroup,
  ],
  fieldsets: [
    ...imageFieldsets,
  ],
  fields: [
    // NORSK INNHOLD
    defineField({
      name: 'title_no',
      title: 'Sidetittel (norsk)',
      type: 'string',
      description: 'Tittel på siden på norsk',
      validation: (Rule) => Rule.required(),
      group: 'no',
    }),
    defineField({
      name: 'slug_no',
      title: 'URL (norsk)',
      type: 'slug',
      description: 'URL-vennlig versjon av norsk sidetittel',
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
      name: 'content_no',
      title: 'Sideinnhold (norsk)',
      type: 'pageBuilder',
      description: 'Bygg norsk side med komponenter og innhold',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'title_en',
      title: 'Page title (English)',
      type: 'string',
      description: 'Page title in English',
      group: 'en',
    }),
    defineField({
      name: 'slug_en',
      title: 'URL (English)',
      type: 'slug',
      description: 'URL-friendly version of English page title',
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
      name: 'content_en',
      title: 'Page content (English)',
      type: 'pageBuilder',
      description: 'Build English page with components and content',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
    }),

    // HOVEDBILDE
    ...multilingualImageFields('image'),

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
          description: 'Når denne siden blir synlig på nettsiden',
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
          description: 'Når denne siden slutter å være synlig på nettsiden',
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
      group: 'publishing',
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title_no: 'title_no',
      title_en: 'title_en',
      publishingStatus: 'publishingStatus',
      scheduledStart: 'scheduledPeriod.startDate',
      scheduledEnd: 'scheduledPeriod.endDate',
      hasNorwegian: 'content_no',
      hasEnglish: 'content_en',
      _id: '_id',
    },
    prepare({title_no, title_en, publishingStatus, scheduledStart, scheduledEnd, hasNorwegian, hasEnglish, _id}) {
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
      if (hasNorwegian || title_no) languages.push('🇳🇴');
      if (hasEnglish || title_en) languages.push('🇬🇧');
      const langStatus = languages.length > 0 ? languages.join(' ') : '⚠️';

      const title = title_no || title_en || 'Uten tittel';

      return {
        title: title,
        subtitle: `${statusText} • ${langStatus}`,
        media: DocumentIcon,
      };
    },
  },
})
