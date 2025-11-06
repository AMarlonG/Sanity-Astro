import {defineField, defineType} from 'sanity'
import {DashboardIcon} from '@sanity/icons'

export const threeColumnLayout = defineType({
  name: 'threeColumnLayout',
  title: 'Tre kolonner',
  type: 'object',
  icon: DashboardIcon,
  description: 'Plasser tre komponenter side ved side (stabler vertikalt på mobil)',
  fields: [
    defineField({
      name: 'column1',
      title: 'Kolonne 1',
      type: 'array',
      description: 'Første kolonne (venstre)',
      of: [
        {type: 'imageComponent'},
        {type: 'videoComponent'},
        {type: 'spotifyComponent'},
        {type: 'quoteComponent'},
        {type: 'portableTextBlock'},
        {type: 'headingComponent'},
        {type: 'buttonComponent'},
        {type: 'accordionComponent'},
      ],
      validation: (Rule) =>
        Rule.required()
          .max(1)
          .error('Kolonne 1 kan bare ha én komponent'),
    }),
    defineField({
      name: 'column2',
      title: 'Kolonne 2',
      type: 'array',
      description: 'Andre kolonne (midten)',
      of: [
        {type: 'imageComponent'},
        {type: 'videoComponent'},
        {type: 'spotifyComponent'},
        {type: 'quoteComponent'},
        {type: 'portableTextBlock'},
        {type: 'headingComponent'},
        {type: 'buttonComponent'},
        {type: 'accordionComponent'},
      ],
      validation: (Rule) =>
        Rule.required()
          .max(1)
          .error('Kolonne 2 kan bare ha én komponent'),
    }),
    defineField({
      name: 'column3',
      title: 'Kolonne 3',
      type: 'array',
      description: 'Tredje kolonne (høyre)',
      of: [
        {type: 'imageComponent'},
        {type: 'videoComponent'},
        {type: 'spotifyComponent'},
        {type: 'quoteComponent'},
        {type: 'portableTextBlock'},
        {type: 'headingComponent'},
        {type: 'buttonComponent'},
        {type: 'accordionComponent'},
      ],
      validation: (Rule) =>
        Rule.required()
          .max(1)
          .error('Kolonne 3 kan bare ha én komponent'),
    }),
  ],
  preview: {
    select: {
      column1: 'column1',
      column2: 'column2',
      column3: 'column3',
    },
    prepare({column1, column2, column3}) {
      const col1Type = column1?.[0]?._type || 'tom'
      const col2Type = column2?.[0]?._type || 'tom'
      const col3Type = column3?.[0]?._type || 'tom'

      return {
        title: 'Tre kolonner',
        subtitle: `${col1Type} | ${col2Type} | ${col3Type}`,
        media: DashboardIcon,
      }
    },
  },
})
