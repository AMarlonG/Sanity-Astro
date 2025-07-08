import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const linkComponentType = defineType({
  name: 'linkComponent',
  title: 'Lenke',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Lenketekst',
      type: 'string',
      description: 'Teksten som vises som lenke',
      validation: (Rule) => Rule.required().error('Lenketekst er påkrevd'),
    }),
    defineField({
      name: 'link',
      title: 'Lenke',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Lenketype',
          type: 'string',
          options: {
            list: [
              {title: 'Intern lenke', value: 'internal'},
              {title: 'Ekstern URL', value: 'external'},
              {title: 'E-post', value: 'email'},
              {title: 'Telefon', value: 'phone'},
              {title: 'Anker', value: 'anchor'},
            ],
          },
          initialValue: 'internal',
        },
        {
          name: 'internalLink',
          title: 'Intern lenke',
          type: 'reference',
          description: 'Velg en side fra nettstedet',
          hidden: ({parent}) => parent?.type !== 'internal',
          to: [{type: 'pages'}, {type: 'articles'}, {type: 'events'}],
        },
        {
          name: 'externalUrl',
          title: 'Ekstern URL',
          type: 'url',
          description: 'F.eks. https://example.com',
          hidden: ({parent}) => parent?.type !== 'external',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'email',
          title: 'E-postadresse',
          type: 'email',
          description: 'F.eks. kontakt@example.com',
          hidden: ({parent}) => parent?.type !== 'email',
        },
        {
          name: 'phone',
          title: 'Telefonnummer',
          type: 'string',
          description: 'F.eks. +47 123 45 678',
          hidden: ({parent}) => parent?.type !== 'phone',
        },
        {
          name: 'anchor',
          title: 'Anker-ID',
          type: 'string',
          description: 'ID på elementet på samme side (f.eks. "contact")',
          hidden: ({parent}) => parent?.type !== 'anchor',
        },
      ],
      validation: (Rule) => Rule.required().error('Lenke er påkrevd'),
    }),
    defineField({
      name: 'style',
      title: 'Stil',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'default'},
          {title: 'Understreket', value: 'underlined'},
          {title: 'Knapp-lignende', value: 'button'},
          {title: 'Ikon', value: 'icon'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      description: 'Åpner lenken i en ny fane (anbefalt for eksterne lenker)',
      initialValue: false,
    }),
    defineField({
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      description: 'Navn på ikon (krever ikonbibliotek i frontend)',
      options: {
        list: [
          {title: 'Ingen', value: ''},
          {title: 'Ekstern lenke', value: 'external-link'},
          {title: 'Nedlasting', value: 'download'},
          {title: 'E-post', value: 'mail'},
          {title: 'Telefon', value: 'phone'},
          {title: 'Pil høyre', value: 'arrow-right'},
        ],
      },
    }),
    defineField({
      name: 'iconPosition',
      title: 'Ikonposisjon',
      type: 'string',
      options: {
        list: [
          {title: 'Venstre', value: 'left'},
          {title: 'Høyre', value: 'right'},
        ],
      },
      initialValue: 'right',
      hidden: ({parent}) => !parent?.icon,
    }),
    defineField({
      name: 'accessibility',
      title: 'Tilgjengelighet',
      type: 'object',
      fields: [
        {
          name: 'ariaLabel',
          title: 'ARIA Label',
          type: 'string',
          description:
            'Beskrivende tekst for skjermlesere (hvis lenketeksten ikke er tilstrekkelig)',
        },
        {
          name: 'ariaDescribedBy',
          title: 'ARIA Described By',
          type: 'string',
          description: 'ID til element som beskriver lenken',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'text',
      style: 'style',
      linkType: 'link.type',
    },
    prepare({title, style, linkType}) {
      return {
        title: title || 'Lenke uten tekst',
        subtitle: `${style} • ${linkType || 'ingen lenke'}`,
        media: DocumentIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra lenke-data
export function generateLinkHtml(data: {
  text: string
  link: {
    type: string
    internalLink?: any
    externalUrl?: string
    email?: string
    phone?: string
    anchor?: string
  }
  style: string
  openInNewTab: boolean
  icon?: string
  iconPosition?: string
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
  }
}): string {
  if (!data.text || !data.link) {
    return ''
  }

  const escapedText = escapeHtml(data.text)
  const styleClass = `link-${data.style}`

  // Generer href basert på lenketype
  let href = '#'
  let target = ''
  let rel = ''
  let ariaLabel = ''

  switch (data.link.type) {
    case 'internal':
      if (data.link.internalLink?.slug?.current) {
        href = `/${data.link.internalLink.slug.current}`
      }
      break
    case 'external':
      href = data.link.externalUrl || '#'
      if (data.openInNewTab) {
        target = '_blank'
        rel = 'noopener noreferrer'
        ariaLabel = `${escapedText} (åpner i ny fane)`
      }
      break
    case 'email':
      href = `mailto:${data.link.email || ''}`
      ariaLabel = `Send e-post til ${data.link.email}`
      break
    case 'phone':
      href = `tel:${data.link.phone || ''}`
      ariaLabel = `Ring ${data.link.phone}`
      break
    case 'anchor':
      href = `#${data.link.anchor || ''}`
      break
  }

  // Bruk custom ARIA label hvis spesifisert
  if (data.accessibility?.ariaLabel) {
    ariaLabel = escapeHtml(data.accessibility.ariaLabel)
  }

  // Generer ikon HTML hvis spesifisert
  let iconHtml = ''
  if (data.icon) {
    const iconClass = `icon-${data.icon}`
    iconHtml = `<span class="${iconClass}" aria-hidden="true"></span>`
  }

  // Bygg lenke HTML
  let html = `<a href="${href}" class="link ${styleClass}"`

  if (target) html += ` target="${target}"`
  if (rel) html += ` rel="${rel}"`
  if (ariaLabel) html += ` aria-label="${ariaLabel}"`
  if (data.accessibility?.ariaDescribedBy) {
    html += ` aria-describedby="${escapeHtml(data.accessibility.ariaDescribedBy)}"`
  }

  html += '>'

  if (data.icon && data.iconPosition === 'left') {
    html += iconHtml
  }

  html += escapedText

  if (data.icon && data.iconPosition === 'right') {
    html += iconHtml
  }

  html += '</a>'

  return html
}

// HTML escape utility function
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
