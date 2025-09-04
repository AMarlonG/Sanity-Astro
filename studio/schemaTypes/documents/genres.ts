import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'
import {genreSlugValidation} from '../../lib/slugValidation'

export const genre = defineType({
  name: 'genre',
  title: 'Sjangre',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Navn på sjanger',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis brukeren prøver å publisere
        if (!value && context.document?.isPublished) {
          return 'Tittel bør fylles ut før publisering'
        }
        return true
      }),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'Trykk generer for å lage URL',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom(async (value, context) => {
        // Først sjekk custom slug validering
        const slugValidation = await genreSlugValidation(value, context)
        if (slugValidation !== true) return slugValidation
        
        // Så sjekk om slug mangler, men kun hvis tittel finnes
        if (!value?.current && context.document?.title) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
    }),
  ],
})
