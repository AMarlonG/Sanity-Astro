import {defineField, defineType} from 'sanity'
import {CalendarIcon, ComposeIcon} from '@sanity/icons'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'

export const programPage = defineType({
  name: 'programPage',
  title: 'Programside',
  type: 'document',
  icon: CalendarIcon,
  __experimental_formPreviewTitle: false,
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
      name: 'events',
      title: 'Arrangementer',
      icon: CalendarIcon,
    },
  ],
  fields: [
    // NORSK INNHOLD
    defineField({
      name: 'title_no',
      title: 'Tittel (norsk)',
      type: 'string',
      description: 'Tittel på programsiden på norsk',
      initialValue: 'Program',
      validation: (Rule) => Rule.required(),
      group: 'no',
    }),
    defineField({
      name: 'slug_no',
      title: 'URL (norsk)',
      type: 'slug',
      description: 'URL for norsk programside (anbefalt: "program")',
      options: {
        source: 'title_no',
        maxLength: 96,
      },
      initialValue: {current: 'program'},
      validation: (Rule) => Rule.required(),
      group: 'no',
    }),
    defineField({
      name: 'excerpt_no',
      title: 'Ingress (norsk)',
      type: 'text',
      description: 'Kort beskrivelse av programsiden på norsk',
      rows: 2,
      validation: (Rule) => Rule.max(200),
      group: 'no',
    }),
    defineField({
      name: 'content_no',
      title: 'Sideinnhold (norsk)',
      type: 'pageBuilder',
      description: 'Bygg norsk programside med komponenter og innhold',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      description: 'Program page title in English',
      group: 'en',
    }),
    defineField({
      name: 'slug_en',
      title: 'URL (English)',
      type: 'slug',
      description: 'URL for English program page (recommended: "program")',
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
      group: 'en',
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      description: 'Short description of the program page in English',
      rows: 2,
      validation: (Rule) => Rule.max(200),
      group: 'en',
    }),
    defineField({
      name: 'content_en',
      title: 'Page content (English)',
      type: 'pageBuilder',
      description: 'Build English program page with components and content',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
    }),

    // ARRANGEMENTER (DELT)
    defineField({
      name: 'selectedEvents',
      title: 'Valgte arrangementer',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'event'}],
        }
      ],
      description: 'Velg arrangementer som skal vises på programsiden (vises på begge språk)',
      group: 'events',
    }),
  ],
  preview: {
    select: {
      title_no: 'title_no',
      title_en: 'title_en',
      slug_no: 'slug_no.current',
      slug_en: 'slug_en.current',
      hasNorwegian: 'content_no',
      hasEnglish: 'content_en',
    },
    prepare({title_no, title_en, slug_no, slug_en, hasNorwegian, hasEnglish}) {
      // Language status
      const languages: string[] = [];
      if (hasNorwegian || title_no) languages.push('🇳🇴');
      if (hasEnglish || title_en) languages.push('🇬🇧');
      const langStatus = languages.length > 0 ? languages.join(' ') : '⚠️';

      const title = title_no || title_en || 'Programside';
      const slug = slug_no || slug_en || 'program';

      return {
        title: title,
        subtitle: `/${slug} • ${langStatus}`,
        media: CalendarIcon,
      };
    },
  },
})