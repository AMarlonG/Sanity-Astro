import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {externalURLValidation} from '../../../lib/urlValidation'
import {componentSpecificValidation} from '../../shared/validation'
import type {ComponentHTMLGenerator, ValidationRule} from '../../shared/types'

export const linkComponent = defineType({
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
      validation: componentSpecificValidation.linkText,
    }),
    defineField({
      name: 'linkType',
      title: 'Lenketype',
      type: 'string',
      options: {
        list: [
          {title: 'Intern lenke', value: 'internal'},
          {title: 'Ekstern URL', value: 'url'},
          {title: 'E-post', value: 'email'},
          {title: 'Telefon', value: 'phone'},
        ],
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Intern lenke',
      type: 'reference',
      description: 'Velg en side fra nettstedet',
      hidden: ({parent}) => parent?.linkType !== 'internal',
              to: [{type: 'homepage'}, {type: 'page'}, {type: 'article'}, {type: 'event'}],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'F.eks. https://example.com',
      hidden: ({parent}) => parent?.linkType !== 'url',
      validation: (Rule) => Rule.custom(externalURLValidation),
    }),
    defineField({
      name: 'email',
      title: 'E-postadresse',
      type: 'email',
      description: 'F.eks. kontakt@example.com',
      hidden: ({parent}) => parent?.linkType !== 'email',
    }),
    defineField({
      name: 'phone',
      title: 'Telefonnummer',
      type: 'string',
      description: 'F.eks. +47 123 45 678',
      hidden: ({parent}) => parent?.linkType !== 'phone',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      description: 'Åpner lenken i en ny fane (anbefalt for eksterne lenker)',
      initialValue: false,
    }),
    defineField({
      name: 'accessibility',
      title: 'Tilgjengelighet',
      type: 'object',
      hidden: true, // Skjul fra brukergrensesnittet
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
      linkType: 'linkType',
      openInNewTab: 'openInNewTab',
      url: 'url',
      email: 'email',
      phone: 'phone',
      internalLink: 'internalLink.slug.current',
    },
    prepare({title, linkType, openInNewTab, url, email, phone, internalLink}) {
      // Bestem hvilken URL/lenke som skal vises
      let linkDisplay = linkType || 'ingen lenke'

      if (linkType === 'url' && url) {
        linkDisplay = url.length > 30 ? `${url.substring(0, 30)}...` : url
      } else if (linkType === 'email' && email) {
        linkDisplay = email
      } else if (linkType === 'phone' && phone) {
        linkDisplay = phone
      } else if (linkType === 'internal' && internalLink) {
        linkDisplay = `/${internalLink}`
      }

      return {
        title: 'Lenke',
        subtitle: `${title || 'Uten tekst'} • ${linkDisplay}${openInNewTab ? ' (ny fane)' : ''}`,
        media: DocumentIcon,
      }
    },
  },
})

// TypeScript interface for Link component data
export interface LinkComponentData {
  text: string
  linkType: 'internal' | 'url' | 'email' | 'phone'
  internalLink?: {
    slug: {
      current: string
    }
  }
  url?: string
  email?: string
  phone?: string
  openInNewTab: boolean
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
  }
}

// Funksjon for å generere HTML fra lenke-data
export const generateLinkHtml: ComponentHTMLGenerator<LinkComponentData> = (data: LinkComponentData): string => {
  if (!data.text || !data.linkType) {
    return ''
  }

  const escapedText = escapeHtml(data.text)

  // Generer href basert på lenketype
  let href = '#'
  let target = ''
  let rel = ''

  switch (data.linkType) {
    case 'internal':
      if (data.internalLink?.slug?.current) {
        href = `/${data.internalLink.slug.current}`
      }
      break
    case 'url':
      if (data.url) {
        href = data.url
        if (data.openInNewTab) {
          target = '_blank'
          rel = 'noopener noreferrer'
        }
      }
      break
    case 'email':
      if (data.email) {
        href = `mailto:${data.email}`
      }
      break
    case 'phone':
      if (data.phone) {
        href = `tel:${data.phone}`
      }
      break
  }

  // Bygg lenke HTML
  let html = `<a href="${escapeHtml(href)}"`

  if (target) html += ` target="${target}"`
  if (rel) html += ` rel="${rel}"`

  // ARIA-attributter kan legges til av frontend-utvikleren basert på lenketekst og kontekst

  html += `>${escapedText}</a>`

  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Type-safe validation functions
export const linkValidationRules = {
  text: componentSpecificValidation.linkText as ValidationRule,
  url: (Rule: any) => Rule.custom(externalURLValidation) as ValidationRule,
} as const

// Utility function to build href from link data
export function buildLinkHref(data: LinkComponentData): string {
  switch (data.linkType) {
    case 'internal':
      return data.internalLink?.slug?.current ? `/${data.internalLink.slug.current}` : '#'
    case 'url':
      return data.url || '#'
    case 'email':
      return data.email ? `mailto:${data.email}` : '#'
    case 'phone':
      return data.phone ? `tel:${data.phone}` : '#'
    default:
      return '#'
  }
}
