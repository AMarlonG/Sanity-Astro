import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

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
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne dette spillestedet på nettsiden',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
})
