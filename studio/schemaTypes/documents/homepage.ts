import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const homepage = defineType({
  name: 'homepage',
  title: 'Forsider',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne forsiden på nettsiden',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg forsiden med komponenter og innhold',
    }),
  ],
})
