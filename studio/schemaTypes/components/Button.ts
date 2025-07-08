import {defineField, defineType} from 'sanity'
import {DocumentIcon, BoltIcon} from '@sanity/icons'

export const buttonComponentType = defineType({
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
      description: 'Visuell stil for knappen',
      options: {
        list: [
          {title: 'Primær', value: 'primary'},
          {title: 'Sekundær', value: 'secondary'},
          {title: 'Utline', value: 'outline'},
          {title: 'Ghost', value: 'ghost'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'string',
      description: 'Størrelsen på knappen',
      options: {
        list: [
          {title: 'Liten', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Stor', value: 'large'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'action',
      title: 'Handling',
      type: 'string',
      description: 'Hva som skjer når knappen klikkes',
      options: {
        list: [
          {title: 'Lenke til URL', value: 'url'},
          {title: 'Skjema send', value: 'submit'},
          {title: 'Modal åpne', value: 'modal'},
          {title: 'JavaScript funksjon', value: 'function'},
        ],
      },
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'URL som knappen skal lenke til (hvis handling er "Lenke til URL")',
      hidden: ({parent}) => parent?.action !== 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'target',
      title: 'Mål',
      type: 'string',
      description: 'Hvor lenken skal åpnes',
      options: {
        list: [
          {title: 'Samme vindu', value: '_self'},
          {title: 'Nytt vindu', value: '_blank'},
          {title: 'Parent vindu', value: '_parent'},
          {title: 'Top vindu', value: '_top'},
        ],
      },
      hidden: ({parent}) => parent?.action !== 'url',
    }),
    defineField({
      name: 'disabled',
      title: 'Deaktivert',
      type: 'boolean',
      description: 'Om knappen skal være deaktivert',
      initialValue: false,
    }),
    defineField({
      name: 'icon',
      title: 'Ikon (valgfritt)',
      type: 'string',
      description: 'Ikon som skal vises på knappen',
      options: {
        list: [
          {title: 'Ingen', value: ''},
          {title: 'Pil høyre', value: 'arrow-right'},
          {title: 'Pil ned', value: 'arrow-down'},
          {title: 'Plus', value: 'plus'},
          {title: 'Minus', value: 'minus'},
          {title: 'Søk', value: 'search'},
          {title: 'Lukk', value: 'close'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'text',
      style: 'style',
      size: 'size',
      action: 'action',
    },
    prepare({title, style, size, action}) {
      return {
        title: title || 'Knapp uten tekst',
        subtitle: `${style} • ${size} • ${action || 'ingen handling'}`,
        media: BoltIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra knapp-data
export function generateButtonHtml(data: {
  text: string
  action: string
  functionName?: string
  scrollTarget?: string
  style: string
  size: string
  fullWidth: boolean
  icon?: string
  iconPosition?: string
}): string {
  if (!data.text || !data.action) {
    return ''
  }

  const escapedText = escapeHtml(data.text)
  const styleClass = `btn-${data.style}`
  const sizeClass = `btn-${data.size}`
  const widthClass = data.fullWidth ? 'btn-full' : ''

  // Generer onclick basert på handling
  let onclick = ''
  let type = 'button'

  switch (data.action) {
    case 'function':
      if (data.functionName) {
        onclick = `onclick="${data.functionName}()"`
      }
      break
    case 'submit':
      type = 'submit'
      break
    case 'dialog':
      onclick = 'onclick="openDialog()"'
      break
    case 'scroll':
      if (data.scrollTarget) {
        onclick = `onclick="document.querySelector('${data.scrollTarget}').scrollIntoView({behavior: 'smooth'})"`
      }
      break
  }

  // Generer ikon HTML hvis spesifisert
  let iconHtml = ''
  if (data.icon) {
    const iconClass = `icon-${data.icon}`
    iconHtml = `<span class="${iconClass}"></span>`
  }

  // Bygg knapp HTML
  let html = `<button type="${type}" class="btn ${styleClass} ${sizeClass} ${widthClass}"`

  if (onclick) html += ` ${onclick}`

  html += '>'

  if (data.icon && data.iconPosition === 'left') {
    html += iconHtml
  }

  html += escapedText

  if (data.icon && data.iconPosition === 'right') {
    html += iconHtml
  }

  html += '</button>'

  return html
}

// HTML escape utility function
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
