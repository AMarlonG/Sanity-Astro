import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'

export const artist = defineType({
  name: 'artist',
  title: 'Artister',
  type: 'document',
  icon: UserIcon,
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      default: true,
    },
    {
      name: 'image',
      title: 'Bilde',
    },
    {
      name: 'links',
      title: 'Lenker',
    },
    {
      name: 'content',
      title: 'Innhold',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne artisten på nettsiden',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'imageComponent',
      description: 'Bilde av artisten med alt-tekst og kreditering',
      group: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instrument',
      title: 'Instrument',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Nettside',
      type: 'url',
      description: 'Artistens offisielle nettside',
      group: 'links',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Sosiale medier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plattform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter/X', value: 'twitter'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Spotify', value: 'spotify'},
                  {title: 'SoundCloud', value: 'soundcloud'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Annet', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Lenke til artistens profil på denne plattformen',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'customLabel',
              title: 'Egendefinert etikett',
              type: 'string',
              description: 'Valgfri egendefinert etikett (f.eks. "Bandcamp" eller "Apple Music")',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
              customLabel: 'customLabel',
            },
            prepare({platform, url, customLabel}) {
              const platformLabels = {
                facebook: 'Facebook',
                instagram: 'Instagram',
                twitter: 'Twitter/X',
                youtube: 'YouTube',
                spotify: 'Spotify',
                soundcloud: 'SoundCloud',
                tiktok: 'TikTok',
                linkedin: 'LinkedIn',
                other: 'Annet',
              }
              
              const label = customLabel || platformLabels[platform] || platform
              return {
                title: label,
                subtitle: url,
              }
            },
          },
        },
      ],
      description: 'Legg til lenker til artistens sosiale medier',
      group: 'links',
    }),
    defineField({
      name: 'content',
      title: 'Artistinnhold',
      type: 'pageBuilder',
      description: 'Bygg artist-siden med komponenter og innhold',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'instrument',
      media: 'image.image',
    },
  },
})
