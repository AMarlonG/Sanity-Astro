import {defineField, defineType} from 'sanity'
import {WarningOutlineIcon, ComposeIcon} from '@sanity/icons'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'
import {multilingualImageFields, imageFieldsets, imageGroup} from '../shared/imageFields'

export const error404 = defineType({
  name: 'error404',
  title: '404 - Side ikke funnet',
  type: 'document',
  icon: WarningOutlineIcon,
  __experimental_omnisearch_visibility: false,
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
      description: 'Hovedtittel på 404-siden på norsk',
      validation: (Rule) => Rule.required(),
      group: 'no',
      initialValue: '404 - Side ikke funnet',
    }),
    defineField({
      name: 'content_no',
      title: 'Sideinnhold (norsk)',
      type: 'pageBuilder',
      description: 'Bygg norsk 404-side med komponenter og innhold. Tittel er allerede H1.',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'title_en',
      title: 'Page title (English)',
      type: 'string',
      description: 'Main title for the 404 page in English',
      group: 'en',
      initialValue: '404 - Page not found',
    }),
    defineField({
      name: 'content_en',
      title: 'Page content (English)',
      type: 'pageBuilder',
      description: 'Build English 404 page with components and content. Title is already H1.',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
    }),

    // HOVEDBILDE (valgfritt)
    ...multilingualImageFields('image'),
  ],
  preview: {
    select: {
      title_no: 'title_no',
      title_en: 'title_en',
      hasNorwegian: 'content_no',
      hasEnglish: 'content_en',
    },
    prepare({title_no, title_en, hasNorwegian, hasEnglish}) {
      // Language status
      const languages: string[] = [];
      if (hasNorwegian || title_no) languages.push('🇳🇴');
      if (hasEnglish || title_en) languages.push('🇬🇧');
      const langStatus = languages.length > 0 ? languages.join(' ') : '⚠️';

      return {
        title: '404 - Side ikke funnet',
        subtitle: langStatus,
        media: WarningOutlineIcon,
      };
    },
  },
})