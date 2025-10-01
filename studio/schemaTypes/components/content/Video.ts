import {defineField, defineType} from 'sanity'
import {DocumentIcon, PlayIcon} from '@sanity/icons'
import {componentValidation} from '../../shared/validation'
import type {VideoData, ComponentHTMLGenerator, ValidationRule} from '../../shared/types'

export const videoComponent = defineType({
  name: 'videoComponent',
  title: 'Video',
  type: 'object',
  icon: DocumentIcon,
  description: 'Legg til video fra YouTube, Vimeo eller last opp egen fil',
  groups: [
    {
      name: 'content',
      title: 'Innhold',
      default: true,
    },
    {
      name: 'display',
      title: 'Visning & Avspilling',
    },
  ],
  fields: [
    defineField({
      name: 'videoType',
      title: 'Video-type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Sanity Video', value: 'sanity'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'Ekstern URL', value: 'external'},
        ],
      },
      initialValue: 'sanity',
      validation: componentValidation.title,
    }),
    defineField({
      name: 'video',
      title: 'Sanity Video',
      type: 'file',
      group: 'content',
      description: 'Last opp en video-fil',
      hidden: ({parent}) => parent?.videoType !== 'sanity',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'content',
      description: 'Lim inn YouTube video URL (f.eks. https://www.youtube.com/watch?v=...)',
      hidden: ({parent}) => parent?.videoType !== 'youtube',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).custom((url) => {
          if (!url) return true
          return url.includes('youtube.com') || url.includes('youtu.be')
            ? true
            : 'Må være en gyldig YouTube URL'
        }),
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
      group: 'content',
      description: 'Lim inn Vimeo video URL (f.eks. https://vimeo.com/...)',
      hidden: ({parent}) => parent?.videoType !== 'vimeo',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).custom((url) => {
          if (!url) return true
          return url.includes('vimeo.com') ? true : 'Må være en gyldig Vimeo URL'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Ekstern Video URL',
      type: 'url',
      group: 'content',
      description: 'Lim inn URL til video-fil (MP4, WebM, etc.)',
      hidden: ({parent}) => parent?.videoType !== 'external',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Videoformat',
      type: 'string',
      group: 'display',
      description: 'Velg format for videoen (bredde:høyde)',
      options: {
        list: [
          {title: 'Portrett (4:5)', value: '4:5'},
          {title: 'Kvadrat (1:1)', value: '1:1'},
          {title: 'Landskap (16:9)', value: '16:9'},
          {title: 'Portrett (9:16)', value: '9:16'},
        ],
      },
      initialValue: '16:9',
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      group: 'content',
      description: 'Tittel for videoen (valgfritt)',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      group: 'content',
      description: 'Valgfri beskrivelse av videoen',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      group: 'display',
      description: 'Start video automatisk når siden lastes',
      initialValue: false,
    }),
    defineField({
      name: 'muted',
      title: 'Dempet',
      type: 'boolean',
      group: 'display',
      description: 'Start video dempet (kreves for autoplay)',
      initialValue: true,
    }),
    defineField({
      name: 'controls',
      title: 'Kontroller',
      type: 'boolean',
      group: 'display',
      description: 'Vis video-kontroller',
      initialValue: true,
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      group: 'display',
      description: 'Spill video på nytt når den er ferdig',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      videoType: 'videoType',
      media: 'video',
      aspectRatio: 'aspectRatio',
      youtubeUrl: 'youtubeUrl',
      vimeoUrl: 'vimeoUrl',
      externalUrl: 'externalUrl',
    },
    prepare({title, subtitle, videoType, media, aspectRatio, youtubeUrl, vimeoUrl, externalUrl}) {
      const formatText = aspectRatio ? ` • Format: ${aspectRatio}` : ''

      // Bestem hvilken video som skal vises i preview
      let previewVideo = null
      if (videoType === 'sanity' && media) {
        previewVideo = media
      } else if (videoType === 'youtube' && youtubeUrl) {
        previewVideo = {url: youtubeUrl, type: 'youtube'}
      } else if (videoType === 'vimeo' && vimeoUrl) {
        previewVideo = {url: vimeoUrl, type: 'vimeo'}
      } else if (videoType === 'external' && externalUrl) {
        previewVideo = {url: externalUrl, type: 'external'}
      }

      return {
        title: 'Video',
        subtitle: `${title || 'Uten tittel'} • ${(subtitle ? `${subtitle} (${videoType})` : videoType || 'Ukjent type')}${formatText}`,
        media: media || PlayIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra video-data
export const generateVideoHtml: ComponentHTMLGenerator<VideoData> = (data: VideoData): string => {
  // Sjekk at vi har en video-URL først
  const hasVideo =
    (data.videoType === 'sanity' && data.video?.asset?.url) ||
    (data.videoType === 'youtube' && data.youtubeUrl) ||
    (data.videoType === 'vimeo' && data.vimeoUrl) ||
    (data.videoType === 'external' && data.externalUrl)

  if (!hasVideo) {
    return ''
  }

  const escapedTitle = data.title ? escapeHtml(data.title) : ''
  const escapedDescription = data.description ? escapeHtml(data.description) : ''
  const aspectRatioClass = data.aspectRatio
    ? `video-aspect-${data.aspectRatio.replace(':', '-')}`
    : 'video-aspect-16-9'

  let html = `<div class="video-container ${aspectRatioClass}">`

  if (escapedTitle) {
    html += `\n  <h3>${escapedTitle}</h3>`
  }

  if (escapedDescription) {
    html += `\n  <p>${escapedDescription}</p>`
  }

  switch (data.videoType) {
    case 'sanity':
      if (data.video?.asset?.url) {
        html += generateSanityVideoHtml(data)
      }
      break
    case 'youtube':
      if (data.youtubeUrl) {
        html += generateYouTubeHtml(data)
      }
      break
    case 'vimeo':
      if (data.vimeoUrl) {
        html += generateVimeoHtml(data)
      }
      break
    case 'external':
      if (data.externalUrl) {
        html += generateExternalVideoHtml(data)
      }
      break
  }

  html += '\n</div>'
  return html
}

function generateSanityVideoHtml(data: VideoData): string {
  if (!data.video?.asset?.url) return ''

  const videoUrl = data.video.asset.url
  const autoplay = data.autoplay ? 'autoplay' : ''
  const muted = data.muted ? 'muted' : ''
  const controls = data.controls ? 'controls' : ''
  const loop = data.loop ? 'loop' : ''

  return `\n  <video ${autoplay} ${muted} ${controls} ${loop} style="width: 100%; max-width: 100%;">
    <source src="${videoUrl}" type="video/mp4">
    Din nettleser støtter ikke video-elementet.
  </video>`
}

function generateYouTubeHtml(data: VideoData): string {
  if (!data.youtubeUrl) return ''
  const videoId = extractYouTubeId(data.youtubeUrl)
  if (!videoId) return ''

  const autoplay = data.autoplay ? '1' : '0'
  const muted = data.muted ? '1' : '0'
  const controls = data.controls ? '1' : '0'
  const loop = data.loop ? '1' : '0'

  return `\n  <iframe 
    width="100%" 
    height="315" 
    src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${muted}&controls=${controls}&loop=${loop}" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>`
}

function generateVimeoHtml(data: VideoData): string {
  if (!data.vimeoUrl) return ''
  const videoId = extractVimeoId(data.vimeoUrl)
  if (!videoId) return ''

  const autoplay = data.autoplay ? '1' : '0'
  const muted = data.muted ? '1' : '0'
  const controls = data.controls ? '1' : '0'
  const loop = data.loop ? '1' : '0'

  return `\n  <iframe 
    width="100%" 
    height="315" 
    src="https://player.vimeo.com/video/${videoId}?autoplay=${autoplay}&muted=${muted}&controls=${controls}&loop=${loop}" 
    frameborder="0" 
    allow="autoplay; fullscreen; picture-in-picture" 
    allowfullscreen>
  </iframe>`
}

function generateExternalVideoHtml(data: VideoData): string {
  if (!data.externalUrl) return ''
  const autoplay = data.autoplay ? 'autoplay' : ''
  const muted = data.muted ? 'muted' : ''
  const controls = data.controls ? 'controls' : ''
  const loop = data.loop ? 'loop' : ''

  return `\n  <video ${autoplay} ${muted} ${controls} ${loop} style="width: 100%; max-width: 100%;">
    <source src="${data.externalUrl}" type="video/mp4">
    Din nettleser støtter ikke video-elementet.
  </video>`
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function extractVimeoId(url: string): string | null {
  const regex = /vimeo\.com\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// HTML escape utility function
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Type-safe validation functions
export const videoValidationRules = {
  title: componentValidation.title as ValidationRule,
  videoType: componentValidation.title as ValidationRule,
} as const

// Utility function to validate video data has required fields
export function hasValidVideoData(data: VideoData): boolean {
  switch (data.videoType) {
    case 'sanity':
      return !!(data.video?.asset?.url)
    case 'youtube':
      return !!(data.youtubeUrl && extractYouTubeId(data.youtubeUrl))
    case 'vimeo':
      return !!(data.vimeoUrl && extractVimeoId(data.vimeoUrl))
    case 'external':
      return !!data.externalUrl
    default:
      return false
  }
}
