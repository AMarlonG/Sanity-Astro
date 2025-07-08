import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const artistsType = defineType({
  name: 'artists',
  title: 'Artister',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne artisten på nettsiden',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description: 'Bilde av artisten',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instrument',
      title: 'Instrument',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Artistinnhold',
      type: 'pageBuilder',
      description: 'Bygg artist-siden med komponenter og innhold',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'instrument',
      media: 'image',
    },
  },
})
