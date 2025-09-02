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
      title: 'Navn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Name (English)',
      type: 'string',
      description: 'English name for the venue (optional)',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne dette spillestedet på nettsiden',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().custom(venueSlugValidation),
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string',
      description: 'Fysisk adresse for spillestedet',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkText',
      title: 'Lenketekst',
      type: 'string',
      description: 'Teksten som vises som lenke til lokasjon',
      fieldset: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkTextEn',
      title: 'Link Text (English)',
      type: 'string',
      description: 'English translation of the location link text (optional)',
      fieldset: 'link',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Lenke-URL',
      type: 'url',
      description: 'URL til Google Maps eller annen lokasjon',
      fieldset: 'link',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
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
      linkText: 'linkText',
      linkUrl: 'linkUrl',
    },
    prepare({title, address, linkText, linkUrl}) {
      return {
        title: title,
        subtitle: `${address || 'Ingen adresse'} • ${linkText || 'Ingen lokasjon'} • ${linkUrl ? new URL(linkUrl).hostname : 'Ingen URL'}`,
        media: HomeIcon,
      };
    },
  },
})
