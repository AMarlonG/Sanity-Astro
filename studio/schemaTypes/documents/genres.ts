import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const genre = defineType({
  name: 'genre',
  title: 'Sjangre',
  type: 'document',
  icon: TagIcon,
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
      description: 'URL-en som brukes for å finne denne sjangeren på nettsiden',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
