import {defineField, defineType} from 'sanity'
import {ComposeIcon} from '@sanity/icons'
import {componentValidation} from '../shared/validation'

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
      validation: componentValidation.title,
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