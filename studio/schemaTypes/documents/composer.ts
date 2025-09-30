import {defineField, defineType} from 'sanity'
import {ComposeIcon} from '@sanity/icons'

export const composer = defineType({
  name: 'composer',
  title: 'Komponister',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Navn på komponist',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis brukeren prøver å publisere
        if (!value && context.document?.publishingStatus === 'published') {
          return 'Navn på komponist bør fylles ut før publisering'
        }
        return true
      }),
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare({name}) {
      return {
        title: name || 'Uten navn',
      };
    },
  },
})