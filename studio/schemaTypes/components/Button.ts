import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'

export const buttonComponent = defineType({
  name: 'buttonComponent',
  title: 'Knapp',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Knappetekst',
      type: 'string',
      description: 'Teksten som vises på knappen',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: 'style',
      title: 'Stil',
      type: 'string',
      description: 'Visuell stil på knappen',
      options: {
        list: [
          {title: 'Primær', value: 'primary'},
          {title: 'Sekundær', value: 'secondary'},
          {title: 'Utkant', value: 'outline'},
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'string',
      description: 'Størrelse på knappen',
      options: {
        list: [
          {title: 'Liten', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Stor', value: 'large'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'action',
      title: 'Handling',
      type: 'string',
      description: 'Hva knappen skal gjøre',
      options: {
        list: [
          {title: 'Gå til lenke', value: 'link'},
          {title: 'Skjema', value: 'form'},
          {title: 'Modal', value: 'modal'},
        ],
      },
      initialValue: 'link',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Lenken knappen skal gå til (f.eks. https://example.com)',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https', 'mailto', 'tel'],
          })
          .error(
            'Vennligst oppgi en gyldig URL som starter med http://, https://, mailto: eller tel:',
          ),
    }),
    defineField({
      name: 'disabled',
      title: 'Deaktivert',
      type: 'boolean',
      description: 'Om knappen skal være deaktivert',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'text',
      style: 'style',
      size: 'size',
      action: 'action',
      url: 'url',
      disabled: 'disabled',
    },
    prepare({title, style, size, action, url, disabled}) {
      return {
        title: title || 'Knapp uten tekst',
        subtitle: `${style || 'primary'} • ${size || 'medium'} • ${action || 'link'}${disabled ? ' (deaktivert)' : ''}`,
        media: BoltIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra knapp-data
export function generateButtonHtml(data: {
  text: string
  url?: string
  style?: string
  size?: string
  action?: string
  disabled?: boolean
}): string {
  if (!data.text) {
    return ''
  }

  const escapedText = escapeHtml(data.text)
  const escapedUrl = data.url ? escapeHtml(data.url) : '#'
  const disabledAttr = data.disabled ? ' disabled' : ''
  const styleClass = data.style ? ` btn-${data.style}` : ' btn-primary'
  const sizeClass = data.size ? ` btn-${data.size}` : ' btn-medium'

  return `<a href="${escapedUrl}" class="btn${styleClass}${sizeClass}"${disabledAttr}>${escapedText}</a>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
