import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {genreSlugValidation} from '../../lib/slugValidation'

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
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      description: 'English translation of the genre title (optional)',
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
      validation: (Rule) => Rule.required().custom(genreSlugValidation),
    }),
  ],
})
