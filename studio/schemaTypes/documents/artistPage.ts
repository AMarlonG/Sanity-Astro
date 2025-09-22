import {defineField, defineType} from 'sanity'
import {UsersIcon, ComposeIcon, UserIcon} from '@sanity/icons'

export const artistPage = defineType({
  name: 'artistPage',
  title: 'Artistside',
  type: 'document',
  icon: UsersIcon,
  __experimental_formPreviewTitle: false,
  groups: [
    {
      name: 'content',
      title: 'Innhold',
      icon: ComposeIcon,
      default: true,
    },
    {
      name: 'artists',
      title: 'Artister',
      icon: UserIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      initialValue: 'Artister',
      validation: (Rule) => Rule.required(),
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av artistsiden',
      rows: 2,
      validation: (Rule) => Rule.max(200),
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg artistsiden med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'selectedArtists',
      title: 'Valgte artister',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artist'}],
        }
      ],
      description: 'Velg artister som skal vises på artistsiden',
      group: 'artists',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: 'Artistside',
        subtitle: `/${slug || 'artister'}`,
      }
    },
  },
})