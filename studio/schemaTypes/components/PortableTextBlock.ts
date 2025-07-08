import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const portableTextBlockType = defineType({
  name: 'portableTextBlock',
  title: 'Legg til tekst',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel (valgfritt)',
      type: 'string',
      description: 'En valgfri tittel for denne tekstblokken',
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'portableText',
      description: 'Rik tekst med formatering, overskrifter, lister og mer',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
    },
    prepare({title, content}) {
      // Hent første tekst fra portable text
      const firstText = content?.[0]?.children?.[0]?.text || ''
      const displayTitle = title || 'Legg til tekst'
      const displaySubtitle = firstText ? `${firstText.substring(0, 50)}...` : 'Ingen innhold'

      return {
        title: displayTitle,
        subtitle: displaySubtitle,
        media: TextIcon,
      }
    },
  },
})
