import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const imageComponentType = defineType({
  name: 'imageComponent',
  title: 'Bilde',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description: 'Last opp eller velg et bilde',
      validation: (Rule) => Rule.required().error('Bilde er påkrevd'),
      options: {
        hotspot: true,
        crop: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beskrivende tekst for tilgjengelighet og SEO',
      validation: (Rule) => Rule.required().error('Alt-tekst er påkrevd for tilgjengelighet'),
    }),
    defineField({
      name: 'caption',
      title: 'Bildetekst',
      type: 'string',
      description: 'Valgfri tekst som vises under bildet',
    }),
    defineField({
      name: 'alignment',
      title: 'Justering',
      type: 'string',
      options: {
        list: [
          {title: 'Venstre', value: 'left'},
          {title: 'Senter', value: 'center'},
          {title: 'Høyre', value: 'right'},
        ],
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'string',
      options: {
        list: [
          {title: 'Liten', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Stor', value: 'large'},
          {title: 'Full bredde', value: 'full'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'metadata',
      title: 'Bilde-metadata',
      type: 'object',
      readOnly: true,
      fields: [
        {
          name: 'dimensions',
          title: 'Dimensjoner',
          type: 'object',
          fields: [
            {name: 'width', type: 'number', title: 'Bredde'},
            {name: 'height', type: 'number', title: 'Høyde'},
          ],
        },
        {
          name: 'palette',
          title: 'Fargepalett',
          type: 'object',
          fields: [
            {
              name: 'dominant',
              type: 'object',
              title: 'Dominant farge',
              fields: [
                {name: 'background', type: 'string', title: 'Bakgrunnsfarge'},
                {name: 'foreground', type: 'string', title: 'Forgrunnsfarge'},
              ],
            },
            {
              name: 'vibrant',
              type: 'object',
              title: 'Vibrant farge',
              fields: [
                {name: 'background', type: 'string', title: 'Bakgrunnsfarge'},
                {name: 'foreground', type: 'string', title: 'Forgrunnsfarge'},
              ],
            },
            {
              name: 'muted',
              type: 'object',
              title: 'Dempet farge',
              fields: [
                {name: 'background', type: 'string', title: 'Bakgrunnsfarge'},
                {name: 'foreground', type: 'string', title: 'Forgrunnsfarge'},
              ],
            },
          ],
        },
        {
          name: 'lqip',
          title: 'LQIP (Low Quality Image Placeholder)',
          type: 'string',
        },
        {
          name: 'blurhash',
          title: 'Blurhash',
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Bilde uten alt-tekst',
        subtitle: subtitle || 'Ingen bildetekst',
        media: media || DocumentIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra bilde-data
export function generateImageHtml(data: {
  image: any
  alt: string
  caption?: string
  alignment?: string
  size?: string
}): string {
  if (!data.image || !data.alt) {
    return ''
  }

  const imageUrl = data.image.asset?.url
  if (!imageUrl) {
    return ''
  }

  const alignmentClass = data.alignment ? `image-${data.alignment}` : 'image-center'
  const sizeClass = data.size ? `image-${data.size}` : 'image-medium'

  // Hent crop og hotspot data hvis tilgjengelig
  const crop = data.image.crop
  const hotspot = data.image.hotspot

  // Generer CSS for crop/hotspot hvis tilgjengelig
  let imageStyle = ''
  if (crop && hotspot) {
    const {x, y} = hotspot
    const {left, top, right, bottom} = crop

    const cropX = left + (right - left) * x
    const cropY = top + (bottom - top) * y

    imageStyle = `object-position: ${cropX * 100}% ${cropY * 100}%;`
  }

  let html = `<div class="image-container ${alignmentClass} ${sizeClass}">`

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
