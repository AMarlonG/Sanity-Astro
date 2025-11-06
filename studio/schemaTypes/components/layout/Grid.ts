import {defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const gridComponent = defineType({
  name: 'gridComponent',
  title: 'Rutenett',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Vis innhold i et rutenett som tilpasser seg skjermstørrelsen',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Valgfri tittel over rutenettet',
    }),
    defineField({
      name: 'columns',
      title: 'Antall kolonner',
      type: 'string',
      description: 'Hvor mange kolonner skal rutenettet ha på desktop?',
      options: {
        list: [
          {title: '2 kolonner', value: '2'},
          {title: '3 kolonner', value: '3'},
        ],
        layout: 'radio',
      },
      initialValue: '3',
      validation: (Rule) => Rule.required().error('Velg antall kolonner'),
    }),
    defineField({
      name: 'items',
      title: 'Innhold',
      type: 'array',
      description: 'Legg til bilder, videoer, sitater eller Spotify-innhold',
      of: [
        {type: 'imageComponent'},
        {type: 'videoComponent'},
        {type: 'quoteComponent'},
        {type: 'spotifyComponent'},
      ],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(12)
          .error('Rutenettet må ha mellom 2 og 12 elementer'),
    }),
    defineField({
      name: 'gap',
      title: 'Avstand mellom elementer',
      type: 'string',
      description: 'Hvor mye plass skal det være mellom elementene?',
      options: {
        list: [
          {title: 'Liten', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Stor', value: 'large'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      columns: 'columns',
      items: 'items',
      gap: 'gap',
    },
    prepare({title, columns, items, gap}) {
      const itemCount = items?.length || 0
      const columnText = columns === '2' ? '2 kolonner' : '3 kolonner'
      const gapText = gap === 'small' ? 'liten' : gap === 'large' ? 'stor' : 'medium'

      return {
        title: title || 'Rutenett',
        subtitle: `${columnText} • ${itemCount} elementer • ${gapText} avstand`,
        media: BlockElementIcon,
      }
    },
  },
})
