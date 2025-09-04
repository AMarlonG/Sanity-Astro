import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {venueSlugValidation} from '../../lib/slugValidation'

export const venue = defineType({
  name: 'venue',
  title: 'Spillesteder',
  type: 'document',
  icon: HomeIcon,
  fieldsets: [
    {
      name: 'link',
      title: 'Lokasjon',
      description: 'Lenke til Google Maps eller annen lokasjon',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Navn på spillested',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Navn på spillested må fylles ut'
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
        const slugValidation = await venueSlugValidation(value, context)
        if (slugValidation !== true) return slugValidation
        
        // Så sjekk om slug mangler, men kun hvis tittel finnes
        if (!value?.current && context.document?.title) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string',
      description: 'Fysisk adresse for spillestedet',
      fieldset: 'link',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Lenke-URL',
      type: 'url',
      description: 'Lenke til kart eller nettside (f.eks. Google Maps)',
      fieldset: 'link',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Hvis adresse er fylt ut, må URL også fylles ut
        if (context.document?.address && !value) {
          return 'Lenke-URL bør fylles ut når adresse er definert'
        }
        return true
      }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      description: 'Åpner lenken i en ny fane (anbefalt for eksterne lenker)',
      fieldset: 'link',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      address: 'address',
      linkUrl: 'linkUrl',
    },
    prepare({title, address, linkUrl}) {
      let hostname = 'Ingen URL'
      try {
        if (linkUrl) {
          hostname = new URL(linkUrl).hostname
        }
      } catch (error) {
        hostname = 'Ugyldig URL'
      }
      
      return {
        title: title,
        subtitle: `${address || 'Ingen adresse'} • ${hostname}`,
        media: HomeIcon,
      };
    },
  },
})
