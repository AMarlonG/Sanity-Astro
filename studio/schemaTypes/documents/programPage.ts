import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const programPage = defineType({
  name: 'programPage',
  title: 'Programside',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      initialValue: 'Program',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL for programsiden (anbefalt: "program")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      initialValue: {current: 'program'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av programsiden',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg programsiden med komponenter og innhold',
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