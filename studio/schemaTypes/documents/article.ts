import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Artikler',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Hovedtittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Undertittel',
      type: 'string',
      description: 'Valgfri undertittel som vises som H2',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne artikkelen på nettsiden',
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
    }),
  ],
})
