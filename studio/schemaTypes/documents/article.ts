import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Artikler',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      default: true,
    },
    {
      name: 'content',
      title: 'Innhold',
    },
    {
      name: 'scheduling',
      title: 'Tidsstyring',
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
})
