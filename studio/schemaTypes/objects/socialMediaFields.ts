import {defineField, defineType} from 'sanity'

/**
 * Reusable social media object type
 */
export const socialMediaType = defineType({
  name: 'socialMedia',
  title: 'Sosiale medier',
  type: 'object',
  icon: '🔗',
  fields: [
    defineField({
      name: 'platform',
      title: 'Plattform',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: '🌐 Nettside', value: 'website'},
          {title: '📧 E-post', value: 'email'},
          {title: '📘 Facebook', value: 'facebook'},
          {title: '📷 Instagram', value: 'instagram'},
          {title: '🎵 Spotify', value: 'spotify'},
          {title: '🎬 YouTube', value: 'youtube'},
          {title: '🎵 SoundCloud', value: 'soundcloud'},
          {title: '🎸 Bandcamp', value: 'bandcamp'},
          {title: '🐦 Twitter/X', value: 'twitter'},
          {title: '🎵 TikTok', value: 'tiktok'},
        ],
      },
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https', 'mailto'],
          })
          .error('Vennligst skriv inn en gyldig URL eller e-postadresse'),
    }),
    defineField({
      name: 'label',
      title: 'Visningsnavn (valgfritt)',
      type: 'string',
      description: 'Overstyr standard plattformnavn hvis ønskelig',
    }),
  ],
  preview: {
    select: {
      platform: 'platform',
      url: 'url',
      label: 'label',
    },
    prepare({platform, url, label}) {
      const platforms = {
        website: '🌐',
        email: '📧',
        facebook: '📘',
        instagram: '📷',
        spotify: '🎵',
        youtube: '🎬',
        soundcloud: '🎵',
        bandcamp: '🎸',
        twitter: '🐦',
        tiktok: '🎵',
      }
      return {
        title: label || platform || 'Sosiale medier',
        subtitle: url,
        media: platforms[platform] || '🔗',
      }
    },
  },
})

/**
 * Reusable social media array field
 */
export const socialMediaField = defineField({
  name: 'socialMedia',
  title: '📱 Sosiale medier',
  type: 'array',
  of: [{type: 'socialMedia'}],
  group: 'contact',
  options: {
    sortable: true,
  },
})