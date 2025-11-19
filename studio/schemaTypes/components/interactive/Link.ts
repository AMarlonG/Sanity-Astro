import {defineField, defineType, defineArrayMember} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import {buttonURLValidation} from '../../../lib/urlValidation'
import {componentSpecificValidation} from '../../shared/validation'

export const linkComponent = defineType({
  name: 'linkComponent',
  title: 'Lenker',
  type: 'object',
  icon: LinkIcon,
  description: 'Lag en gruppe med lenker med valgfri beskrivelsestekst',
  groups: [
    {
      name: 'content',
      title: 'Innhold',
      default: true,
    },
  ],
  fields: [
    defineField({
      name: 'links',
      title: 'Lenker',
      type: 'array',
      group: 'content',
      description: 'Legg til én eller flere lenker',
      validation: (Rule) => Rule.min(1).max(10).error('Du må ha mellom 1 og 10 lenker'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          title: 'Lenke',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'text',
              title: 'Lenketekst',
              type: 'string',
              description: 'Synlig tekst for lenken',
              validation: componentSpecificValidation.linkText,
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Hvor lenken skal gå (https://, mailto:, eller tel:)',
              validation: (Rule) => Rule.required().custom(buttonURLValidation),
            }),
            defineField({
              name: 'description',
              title: 'Beskrivelse',
              type: 'string',
              description: 'Valgfri kort tekst under lenken (én linje)',
              validation: (Rule) => Rule.max(150).warning('Beskrivelsen bør være under 150 tegn'),
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Åpne i ny fane',
              type: 'boolean',
              description: 'Åpne lenken i en ny fane (kun for eksterne lenker)',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'text',
              url: 'url',
              openInNewTab: 'openInNewTab',
            },
            prepare({title, url, openInNewTab}) {
              const newTabText = openInNewTab ? ' • Ny fane' : ''
              return {
                title: title || 'Uten tekst',
                subtitle: `${url || 'Ingen URL'}${newTabText}`,
                media: LinkIcon,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      links: 'links',
    },
    prepare({links}) {
      const linkCount = links?.length || 0
      const firstLinkText = links?.[0]?.text || 'Ingen lenker'

      return {
        title: 'Lenker',
        subtitle: `${linkCount} lenke${linkCount !== 1 ? 'r' : ''} • ${firstLinkText}${linkCount > 1 ? '...' : ''}`,
        media: LinkIcon,
      }
    },
  },
})
