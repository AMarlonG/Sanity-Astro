import {defineField, defineType} from 'sanity'
import {ComposeIcon} from '@sanity/icons'

export const composer = defineType({
  name: 'composer',
  title: 'Komponister',
  type: 'document',
  icon: ComposeIcon,
  fieldsets: [
    {
      name: 'years',
      title: 'Leveår',
      options: {columns: 2},
    },
  ],
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
    defineField({
      name: 'birthYear',
      title: 'Fødselsår',
      type: 'number',
      description: 'F.eks. 1756 for Mozart',
      validation: (Rule) => Rule.positive().integer(),
      fieldset: 'years',
    }),
    defineField({
      name: 'deathYear',
      title: 'Dødsår',
      type: 'number',
      description: 'La stå tom hvis komponisten fortsatt lever',
      validation: (Rule) => Rule.positive().integer(),
      fieldset: 'years',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      birthYear: 'birthYear',
      deathYear: 'deathYear',
    },
    prepare({name, birthYear, deathYear}) {
      const years = birthYear && deathYear 
        ? `${birthYear}-${deathYear}` 
        : birthYear 
          ? `f. ${birthYear}` 
          : '';
      
      return {
        title: name,
        subtitle: years,
      };
    },
  },
})