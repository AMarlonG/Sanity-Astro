import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'
import {componentValidation} from '../../shared/validation'
import type {ValidationRule} from '../../shared/types'

export const spotifyComponent = defineType({
  name: 'spotifyComponent',
  title: 'Spotify',
  type: 'object',
  icon: PlayIcon,
  description: 'Legg til Spotify-innhold (låt, album, spilleliste eller artist)',
  groups: [
    {
      name: 'content',
      title: 'Innhold',
      default: true,
    },
    {
      name: 'display',
      title: 'Visning',
    },
  ],
  fields: [
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      group: 'content',
      description:
        'Lim inn Spotify-link (f.eks. https://open.spotify.com/track/... eller https://open.spotify.com/album/...)',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https'],
          })
          .custom((url) => {
            if (!url) return 'Spotify URL er påkrevd'
            return url.includes('open.spotify.com') || url.includes('spotify:')
              ? true
              : 'Må være en gyldig Spotify URL'
          })
          .error('Spotify URL er påkrevd'),
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      group: 'content',
      description: 'Tittel for Spotify-innholdet (valgfritt)',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Valgfri beskrivelse av innholdet',
    }),
    defineField({
      name: 'height',
      title: 'Høyde',
      type: 'number',
      group: 'display',
      description: 'Høyde på Spotify-spilleren i piksler (standard: 352 for playlister, 152 for låter)',
      validation: (Rule) => Rule.min(80).max(600),
      initialValue: 352,
    }),
    defineField({
      name: 'compact',
      title: 'Kompakt visning',
      type: 'boolean',
      group: 'display',
      description: 'Vis kompakt versjon av spilleren (80px høy)',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      spotifyUrl: 'spotifyUrl',
      compact: 'compact',
    },
    prepare({title, subtitle, spotifyUrl, compact}) {
      // Extract Spotify type from URL
      let spotifyType = 'Ukjent'
      if (spotifyUrl) {
        if (spotifyUrl.includes('/track/')) spotifyType = 'Låt'
        else if (spotifyUrl.includes('/album/')) spotifyType = 'Album'
        else if (spotifyUrl.includes('/playlist/')) spotifyType = 'Spilleliste'
        else if (spotifyUrl.includes('/artist/')) spotifyType = 'Artist'
      }

      const displayMode = compact ? ' • Kompakt' : ''

      return {
        title: title || 'Spotify',
        subtitle: subtitle
          ? `${subtitle} (${spotifyType})${displayMode}`
          : `${spotifyType}${displayMode}`,
        media: MusicIcon,
      }
    },
  },
})

// Type for Spotify data
export interface SpotifyData {
  _type: 'spotifyComponent'
  _key?: string
  spotifyUrl: string
  title?: string
  description?: string
  height?: number
  compact?: boolean
}

// Type-safe validation functions
export const spotifyValidationRules = {
  spotifyUrl: componentValidation.title as ValidationRule,
} as const

// Utility function to extract Spotify ID from URL
export function extractSpotifyId(url: string): string | null {
  if (!url) return null

  // Handle spotify: URIs (e.g., spotify:track:xxxxx)
  if (url.startsWith('spotify:')) {
    const parts = url.split(':')
    return parts.length >= 3 ? parts[2] : null
  }

  // Handle open.spotify.com URLs
  const match = url.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/)
  return match ? match[2] : null
}

// Utility function to determine Spotify embed type
export function getSpotifyEmbedType(url: string): 'track' | 'album' | 'playlist' | 'artist' | null {
  if (!url) return null

  if (url.includes('/track/') || url.includes('spotify:track:')) return 'track'
  if (url.includes('/album/') || url.includes('spotify:album:')) return 'album'
  if (url.includes('/playlist/') || url.includes('spotify:playlist:')) return 'playlist'
  if (url.includes('/artist/') || url.includes('spotify:artist:')) return 'artist'

  return null
}

// Utility function to generate Spotify embed URL
export function generateSpotifyEmbedUrl(url: string, compact: boolean = false): string | null {
  const embedType = getSpotifyEmbedType(url)
  const spotifyId = extractSpotifyId(url)

  if (!embedType || !spotifyId) return null

  return `https://open.spotify.com/embed/${embedType}/${spotifyId}${compact ? '?utm_source=generator&theme=0' : '?utm_source=generator'}`
}

// Utility function to validate Spotify data has required fields
export function hasValidSpotifyData(data: SpotifyData): boolean {
  return !!(data.spotifyUrl && extractSpotifyId(data.spotifyUrl))
}
