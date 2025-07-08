import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'articles',
  title: 'Artikler',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
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
