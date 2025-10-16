import {defineField, defineType} from 'sanity'
import {EllipsisHorizontalIcon} from '@sanity/icons'

export const contentScrollContainer = defineType({
  name: 'contentScrollContainer',
  title: 'Content Scroll Container',
  type: 'object',
  icon: EllipsisHorizontalIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Tittel for scroll-containeren (valgfritt)',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'items',
      title: 'Elementer',
      type: 'array',
      description: 'Legg til mellom 3 og 6 elementer som skal vises i horisontal scroll',
              of: [{type: 'imageComponent'}, {type: 'videoComponent'}, {type: 'quoteComponent'}, {type: 'portableTextBlock'}],
      validation: (Rule) => Rule.max(6).min(3),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'Velg format for elementene i scroll-containeren (bredde:høyde)',
      options: {
        list: [
          {title: 'Landskap (16:9)', value: '16:9'},
          {title: 'Portrett (4:5)', value: '4:5'},
        ],
      },
      initialValue: '16:9',
    }),
    defineField({
      name: 'showScrollbar',
      title: 'Vis scrollbar',
      type: 'boolean',
      description: 'Om scrollbaren skal være synlig eller skjult',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      showScrollbar: 'showScrollbar',
    },
    prepare({title, items, showScrollbar}) {
      const itemCount = items?.length || 0
      const scrollbarStatus = showScrollbar ? 'med scrollbar' : 'uten scrollbar'
      return {
        title: 'Innhold',
        subtitle: `${title || 'Scroll Container'} • ${itemCount} elementer • ${scrollbarStatus}`,
        media: EllipsisHorizontalIcon,
      }
    },
  },
})

