import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const artistPage = defineType({
  name: 'artistPage',
  title: 'Artistside',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      initialValue: 'Artister',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL for artistsiden (anbefalt: "artister")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      initialValue: {current: 'artister'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av artistsiden',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg artistsiden med komponenter og innhold',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title || 'Uten tittel',
        subtitle: `/${slug || 'ingen-url'}`,
      }
    },
  },
})