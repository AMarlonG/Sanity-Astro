import {defineField, defineType} from 'sanity'
import {EllipsisHorizontalIcon} from '@sanity/icons'

export const columnLayout = defineType({
  name: 'columnLayout',
  title: 'Kolonnelayout',
  type: 'object',
  icon: EllipsisHorizontalIcon,
  description:
    'Organiser innhold i kolonner (1-4 kolonner). Velg først antall kolonner, deretter legg til komponenter.',
  fields: [
    // Velg antall kolonner
    defineField({
      name: 'columns',
      title: 'Antall kolonner',
      type: 'string',
      description:
        'Velg hvor mange kolonner du ønsker. Dette bestemmer hvor mange komponenter du kan legge til.',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {value: '1', title: '1 kolonne'},
          {value: '2', title: '2 kolonner'},
          {value: '3', title: '3 kolonner'},
          {value: '4', title: '4 kolonner'},
        ],
      },
    }),

    // Komponentene som skal ligge horisontalt
    defineField({
      name: 'items',
      title: 'Komponenter i kolonner',
      type: 'array',
      description: 'Velg først antall kolonner over, deretter legg til komponenter.',
      of: [
        {type: 'imageComponent'},
        {type: 'videoComponent'},
        {type: 'buttonComponent'},
        {type: 'linkComponent'},
        {type: 'accordionComponent'},
        {type: 'headingComponent'},
        {type: 'quoteComponent'},
        {type: 'portableTextBlock'},
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {cols: 'columns', count: 'items.length'},
    prepare({cols, count}) {
      const columnText = cols === '1' ? 'kolonne' : 'kolonner'
      const itemText = count === 1 ? 'element' : 'elementer'
      return {
        title: `Kolonnelayout: ${cols} ${columnText}`,
        subtitle: `${count || 0} ${itemText}`,
        media: EllipsisHorizontalIcon,
      }
    },
  },
})
