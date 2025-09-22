import {defineField, defineType} from 'sanity'
import {CalendarIcon, ComposeIcon} from '@sanity/icons'

export const programPage = defineType({
  name: 'programPage',
  title: 'Programside',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {
      name: 'content',
      title: 'Innhold',
      icon: ComposeIcon,
      default: true,
    },
    {
      name: 'events',
      title: 'Arrangementer',
      icon: CalendarIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      initialValue: 'Program',
      validation: (Rule) => Rule.required(),
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av programsiden',
      rows: 2,
      validation: (Rule) => Rule.max(200),
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg programsiden med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'selectedEvents',
      title: 'Valgte arrangementer',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'event'}],
        }
      ],
      description: 'Velg arrangementer som skal vises på programsiden',
      group: 'events',
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