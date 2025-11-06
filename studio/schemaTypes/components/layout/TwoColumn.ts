import {defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'

export const twoColumnLayout = defineType({
  name: 'twoColumnLayout',
  title: 'To kolonner',
  type: 'object',
  icon: SplitHorizontalIcon,
  description: 'Plasser to komponenter side ved side (stabler vertikalt på mobil)',
  fields: [
    defineField({
      name: 'leftColumn',
      title: 'Venstre kolonne',
      type: 'array',
      description: 'Komponent som vises til venstre',
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
          .error('Venstre kolonne kan bare ha én komponent'),
    }),
    defineField({
      name: 'rightColumn',
      title: 'Høyre kolonne',
      type: 'array',
      description: 'Komponent som vises til høyre',
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
          .error('Høyre kolonne kan bare ha én komponent'),
    }),
    defineField({
      name: 'reverseOnMobile',
      title: 'Reverser på mobil',
      type: 'boolean',
      description: 'Vis høyre kolonne først på mobil',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      leftColumn: 'leftColumn',
      rightColumn: 'rightColumn',
      reverseOnMobile: 'reverseOnMobile',
    },
    prepare({leftColumn, rightColumn, reverseOnMobile}) {
      const leftType = leftColumn?.[0]?._type || 'tom'
      const rightType = rightColumn?.[0]?._type || 'tom'
      const reverseText = reverseOnMobile ? ' • Reversert mobil' : ''

      return {
        title: 'To kolonner',
        subtitle: `Venstre: ${leftType} | Høyre: ${rightType}${reverseText}`,
        media: SplitHorizontalIcon,
      }
    },
  },
})
