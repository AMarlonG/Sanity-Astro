import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const imageComponentType = defineType({
  name: 'imageComponent',
  title: 'Bilde',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'imageSource',
      title: 'Bildekilde',
      type: 'string',
      options: {
        list: [
          {title: 'Last opp bilde', value: 'upload'},
          {title: 'Velg fra media library', value: 'library'},
        ],
      },
      initialValue: 'upload',
      validation: (Rule) => Rule.required().error('Velg en bildekilde'),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      description:
        'Last opp eller velg et bilde. Sanity optimaliserer bildet automatisk for nettsiden.',
      validation: (Rule) => Rule.required().error('Bilde er påkrevd'),
      options: {
        hotspot: true,
        crop: true,
        accept: 'image/*',
      },
      hidden: ({parent}) => parent?.imageSource !== 'upload',
    }),
    defineField({
      name: 'libraryImage',
      title: 'Velg fra media library',
      type: 'string',
      description: 'Media library kommer snart - dette feltet er midlertidig deaktivert',
      readOnly: true,
      hidden: ({parent}) => parent?.imageSource !== 'library',
    }),
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description:
        'Valgfritt: Beskriv bildet for tilgjengelighet og SEO. La stå tomt hvis bildet er dekorativt eller ikke har informasjonsverdi.',
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
          {title: 'Portrett (9:16)', value: '9:16'},
        ],
      },
      initialValue: '16:9',
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
      hidden: true, // Skjul metadata-feltet helt fra brukergrensesnittet
      description: 'Sanity håndterer bildeoptimalisering automatisk i bakgrunnen',
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
      imageSource: 'imageSource',
      libraryImage: 'libraryImage',
      aspectRatio: 'aspectRatio',
    },
    prepare({title, subtitle, media, imageSource, libraryImage, aspectRatio}) {
      let previewMedia = media || DocumentIcon
      let sourceText = ''

      if (imageSource === 'library') {
        sourceText = ' (Media Library - ikke tilgjengelig ennå)'
      } else if (imageSource === 'upload') {
        sourceText = ' (Opplastet)'
      }

      const formatText = aspectRatio ? ` • Format: ${aspectRatio}` : ''

      return {
        title: (title || 'Bilde uten alt-tekst') + sourceText,
        subtitle: (subtitle || 'Ingen bildetekst') + formatText,
        media: previewMedia,
      }
    },
  },
})

// Funksjon for å generere HTML fra bilde-data
export function generateImageHtml(data: {
  imageSource: string
  image?: any
  libraryImage?: any
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

  if (data.imageSource === 'upload' && data.image) {
    imageUrl = data.image.asset?.url
    crop = data.image.crop
    hotspot = data.image.hotspot
  } else if (data.imageSource === 'library' && data.libraryImage) {
    // Midlertidig: Media library er ikke implementert ennå
    return '<div class="image-placeholder">Media library kommer snart</div>'
  }

  if (!imageUrl) {
    return ''
  }

  const alignmentClass = data.alignment ? `image-${data.alignment}` : 'image-center'
  const sizeClass = data.size ? `image-${data.size}` : 'image-medium'
  const aspectRatioClass = data.aspectRatio
    ? `image-aspect-${data.aspectRatio.replace(':', '-')}`
    : 'image-aspect-16-9'

  // Generer CSS for crop/hotspot hvis tilgjengelig (kun for opplastede og library-bilder)
  let imageStyle = ''
  if (crop && hotspot && (data.imageSource === 'upload' || data.imageSource === 'library')) {
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
