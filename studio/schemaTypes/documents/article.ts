import {defineField, defineType} from 'sanity'
import {DocumentIcon, ComposeIcon, CogIcon} from '@sanity/icons'

export const article = defineType({
  name: 'article',
  title: 'Artikler',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      icon: DocumentIcon,
      default: true,
    },
    {
      name: 'content',
      title: 'Innhold',
      icon: ComposeIcon,
    },
    {
      name: 'scheduling',
      title: 'Tidsstyring',
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Hovedtittel',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      group: 'basic',
      description: 'English translation of the article title (optional)',
    }),
    defineField({
      name: 'subtitle',
      title: 'Undertittel',
      type: 'string',
      description: 'Valgfri undertittel som vises som H2',
      group: 'basic',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'subtitleEn',
      title: 'Subtitle (English)',
      type: 'string',
      group: 'basic',
      description: 'English translation of the subtitle (optional)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne artikkelen på nettsiden',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Artikkelinnhold',
      type: 'pageBuilder',
      description: 'Bygg artikkelen med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'contentEn',
      title: 'Article Content (English)',
      type: 'pageBuilder',
      description: 'English version of the article content (optional)',
      group: 'content',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publisert',
      type: 'boolean',
      description: 'Denne artikkelen er synlig på nettsiden',
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
          description: 'Når denne artikkelen blir synlig på nettsiden',
          fieldset: 'timing',
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når denne artikkelen slutter å være synlig på nettsiden',
          fieldset: 'timing',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      isPublished: 'isPublished',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
    },
    prepare({title, subtitle, isPublished, startDate, endDate}) {
      // Status logic
      let statusIcon = '⚫';
      let statusText = 'Utkast';
      
      if (isPublished) {
        statusIcon = '🟢';
        statusText = 'Publisert';
      } else if (startDate && endDate) {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
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
      
      return {
        title: `${statusIcon} ${title}`,
        subtitle: `${subtitle || 'Ingen undertittel'} • ${statusText}`,
        media: DocumentIcon,
      };
    },
  },
})
