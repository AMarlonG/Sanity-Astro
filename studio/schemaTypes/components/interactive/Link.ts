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
      description: 'Velg hva slags lenke du vil lage: til en side i løsningen, en bestemt seksjon på siden, eller en ekstern adresse.',
      options: {
        list: [
          {title: 'Intern lenke', value: 'internal'},
          {title: 'Seksjon på denne siden', value: 'anchor'},
          {title: 'Ekstern nettside', value: 'url'},
          {title: 'E-postadresse', value: 'email'},
          {title: 'Telefonnummer', value: 'phone'},
        ],
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Intern lenke',
      type: 'reference',
      description: 'Søk frem siden du vil lenke til (f.eks. Program, Artistsiden, artikler eller arrangementer).',
      hidden: ({parent}) => parent?.linkType !== 'internal',
      to: [
        {type: 'homepage'},
        {type: 'page'},
        {type: 'programPage'},
        {type: 'artistPage'},
        {type: 'article'},
        {type: 'event'}
      ],
    }),
    defineField({
      name: 'anchorId',
      title: 'Seksjons-ID (anker)',
      type: 'string',
      description: 'Skriv inn ID-en til seksjonen du vil hoppe til (uten #-tegn). Eksempel: "programdetaljer" gir lenke til #programdetaljer.',
      hidden: ({parent}) => parent?.linkType !== 'anchor',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const linkType = context?.parent?.linkType

          if (linkType !== 'anchor') {
            return true
          }

          if (!value) {
            return 'Seksjons-ID må fylles ut'
          }

          if (value.length > 80) {
            return 'Seksjons-ID må være under 80 tegn'
          }

          if (!/^[A-Za-z][A-Za-z0-9_\-:.]*$/.test(value)) {
            return 'Bruk bokstaver eller tall, og eventuelt bindestrek, understrek, kolon eller punktum. Ikke ta med #-tegnet.'
          }

          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'For eksterne nettsteder. Husk https:// i starten.',
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
      name: 'linkTarget',
      title: 'Lenke-mål',
      type: 'string',
      description: 'Hvordan lenken skal åpnes',
      options: {
        list: [
          { title: 'Samme fane', value: '_self' },
          { title: 'Ny fane (anbefalt)', value: '_blank' }
        ],
        layout: 'radio'
      },
      initialValue: '_self',
      hidden: ({parent}) => parent?.linkType !== 'url',
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
      linkTarget: 'linkTarget',
      url: 'url',
      email: 'email',
      phone: 'phone',
      internalLinkType: 'internalLink->_type',
      internalLinkSlug: 'internalLink->slug.current',
      internalLinkSlugNo: 'internalLink->slug_no.current',
      internalLinkSlugEn: 'internalLink->slug_en.current',
      anchorId: 'anchorId',
    },
    prepare({
      title,
      linkType,
      linkTarget,
      url,
      email,
      phone,
      internalLinkType,
      internalLinkSlug,
      internalLinkSlugNo,
      internalLinkSlugEn,
      anchorId
    }) {
      // Bestem hvilken URL/lenke som skal vises
      let linkDisplay = linkType || 'ingen lenke'

      if (linkType === 'url' && url) {
        linkDisplay = url.length > 30 ? `${url.substring(0, 30)}...` : url
      } else if (linkType === 'email' && email) {
        linkDisplay = email
      } else if (linkType === 'phone' && phone) {
        linkDisplay = phone
      } else if (linkType === 'anchor' && anchorId) {
        linkDisplay = `#${anchorId}`
      } else if (linkType === 'internal') {
        const previewLink: LinkComponentData['internalLink'] | undefined = internalLinkType
          ? {
              _type: internalLinkType,
              slug: internalLinkSlug
                ? {current: internalLinkSlug}
                : internalLinkSlugNo
                  ? {current: internalLinkSlugNo}
                  : internalLinkSlugEn
                    ? {current: internalLinkSlugEn}
                    : undefined
            }
          : undefined

        const resolved = resolveInternalHref(previewLink)
        linkDisplay = resolved || 'Intern lenke'
      }

      return {
        title: 'Lenke',
        subtitle: `${title || 'Uten tekst'} • ${linkDisplay}${linkTarget === '_blank' ? ' (ny fane)' : ''}`,
        media: DocumentIcon,
      }
    },
  },
})

// TypeScript interface for Link component data
export interface LinkComponentData {
  text: string
  linkType: 'internal' | 'anchor' | 'url' | 'email' | 'phone'
  internalLink?: {
    _type?: string
    slug?: {
      current: string
    } | string
  }
  anchorId?: string
  url?: string
  email?: string
  phone?: string
  linkTarget?: '_self' | '_blank'
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
  }
}

const getSlugValue = (link?: LinkComponentData['internalLink']): string | undefined => {
  if (!link) return undefined
  if (typeof link.slug === 'string') return link.slug
  return link.slug?.current
}

const resolveInternalHref = (link?: LinkComponentData['internalLink']): string | undefined => {
  if (!link) return undefined
  const slugValue = getSlugValue(link) || ''

  switch (link._type) {
    case 'homepage':
      return '/'
    case 'programPage':
      return '/program'
    case 'artistPage':
      return '/artister'
    case 'article':
      return slugValue ? `/artikler/${slugValue}` : undefined
    case 'event':
      return slugValue ? `/program/${slugValue}` : undefined
    case 'page':
    default:
      return slugValue ? `/${slugValue}` : undefined
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
      {
        const resolved = resolveInternalHref(data.internalLink)
        if (resolved) {
          href = resolved
        }
      }
      break
    case 'anchor':
      if (data.anchorId) {
        href = data.anchorId.startsWith('#') ? data.anchorId : `#${data.anchorId}`
      }
      break
    case 'url':
      if (data.url) {
        href = data.url
        if (data.linkTarget === '_blank') {
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
      return resolveInternalHref(data.internalLink) || '#'
    case 'anchor':
      return data.anchorId ? (data.anchorId.startsWith('#') ? data.anchorId : `#${data.anchorId}`) : '#'
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
