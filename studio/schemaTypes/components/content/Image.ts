import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const imageComponent = defineType({
  name: 'imageComponent',
  title: 'Bilde',
  type: 'object',
  icon: DocumentIcon,
  description: 'Last opp et bilde med alt-tekst og bildetekst for bedre tilgjengelighet',
  fields: [
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description:
        'Last opp eller velg et bilde. Sanity optimaliserer bildet automatisk for nettsiden.',
      validation: (Rule) => Rule.required().error('Bilde er påkrevd'),
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Bildeformat',
      type: 'string',
      description: 'Velg format for bildet (bredde:høyde)',
      options: {
        list: [
          {title: 'Portrett (4:5)', value: '4:5'},
          {title: 'Kvadrat (1:1)', value: '1:1'},
          {title: 'Landskap (16:9)', value: '16:9'},
          {title: 'Stående (9:16)', value: '9:16'},
        ],
      },
      initialValue: '16:9',
    }),
    defineField({
      name: 'credit',
      title: 'Kreditering',
      type: 'string',
      description:
        'Hvem som har tatt eller eier bildet (f.eks. "Foto: John Doe" eller "Kilde: Unsplash")',
      validation: (Rule) => Rule.required().error('Kreditering er påkrevd'),
    }),
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description:
        'Beskriv bildet for tilgjengelighet og SEO.',
      validation: (Rule) => Rule.required().error('Alt-tekst er påkrevd'),
    }),
    defineField({
      name: 'caption',
      title: 'Bildetekst',
      type: 'string',
      description: 'Valgfri tekst som vises under bildet',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'image',
      aspectRatio: 'aspectRatio',
    },
    prepare({title, subtitle, media, aspectRatio}) {
      const formatText = aspectRatio ? ` • Format: ${aspectRatio}` : ''

      return {
        title: 'Bilde',
        subtitle: `${title || 'Uten alt-tekst'} • ${(subtitle || 'Ingen bildetekst')}${formatText}`,
        media: media || DocumentIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra bilde-data
export function generateImageHtml(data: {
  image?: any
  alt: string
  caption?: string
  alignment?: string
  size?: string
  aspectRatio?: string
}): string {
  if (!data.alt) {
    return ''
  }

  let imageUrl = ''
  let crop = null
  let hotspot = null

  if (data.image) {
    imageUrl = data.image.asset?.url
    crop = data.image.crop
    hotspot = data.image.hotspot
  }

  if (!imageUrl) {
    return ''
  }

  const alignmentClass = data.alignment ? `image-${data.alignment}` : 'image-center'
  const sizeClass = data.size ? `image-${data.size}` : 'image-medium'
  const aspectRatioClass = data.aspectRatio
    ? `image-aspect-${data.aspectRatio.replace(':', '-')}`
    : 'image-aspect-16-9'

  // Generer CSS for crop/hotspot hvis tilgjengelig
  let imageStyle = ''
  if (crop && hotspot) {
    const {x, y} = hotspot
    const {left, top, right, bottom} = crop

    const cropX = left + (right - left) * x
    const cropY = top + (bottom - top) * y

    imageStyle = `object-position: ${cropX * 100}% ${cropY * 100}%;`
  }

  let html = `<div class="image-container ${alignmentClass} ${sizeClass} ${aspectRatioClass}">`

  // Bruk picture-element for bedre responsivitet og format-støtte
  html += `\n  <picture>`
  html += `\n    <source srcset="${imageUrl}?auto=format&fit=crop&w=800&q=80" media="(min-width: 768px)">`
  html += `\n    <source srcset="${imageUrl}?auto=format&fit=crop&w=600&q=80" media="(min-width: 480px)">`
  html += `\n    <img src="${imageUrl}?auto=format&fit=crop&w=400&q=80" alt="${escapeHtml(data.alt)}" style="${imageStyle}" loading="lazy" />`
  html += `\n  </picture>`

  if (data.caption) {
    html += `\n  <figcaption>${escapeHtml(data.caption)}</figcaption>`
  }

  html += '\n</div>'

  return html
}

// Funksjon for å generere optimaliserte bilde-URLer
// Merk: Dette krever @sanity/image-url pakken
export function generateOptimizedImageUrl(
  imageAsset: any,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  } = {},
) {
  if (!imageAsset?.asset?.url) {
    return null
  }

  const {width, height, quality = 80, format = 'webp', fit = 'crop'} = options

  const baseUrl = imageAsset.asset.url
  const params = new URLSearchParams({
    auto: 'format',
    fit,
    q: quality.toString(),
    fm: format,
  })

  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())

  return `${baseUrl}?${params.toString()}`
}

// HTML escape utility function
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
