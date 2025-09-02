import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'
import {buttonURLValidation} from '../../../lib/urlValidation'
import {addGlobalFields, designGroup} from '../../shared/globalFields'
import {componentSpecificValidation} from '../../shared/validation'

export const buttonComponent = defineType({
  name: 'buttonComponent',
  title: 'Knapp',
  type: 'object',
  icon: BoltIcon,
  description: 'Knapp med fleksible design- og handlingsinnstillinger',
  groups: [
    {
      name: 'content',
      title: 'Innhold',
      default: true,
    },
    {
      name: 'settings',
      title: 'Innstillinger',
    },
    designGroup,
  ],
  fields: addGlobalFields([
    defineField({
      name: 'text',
      title: 'Knappetekst',
      type: 'string',
      group: 'content',
      description: 'Teksten som vises på knappen',
      validation: componentSpecificValidation.buttonText,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      group: 'content',
      description: 'Lenken knappen skal gå til (f.eks. https://example.com)',
      validation: (Rule) => Rule.required().custom(buttonURLValidation),
    }),
    defineField({
      name: 'style',
      title: 'Stil',
      type: 'string',
      group: 'settings',
      description: 'Visuell stil på knappen',
      options: {
        list: [
          {title: 'Primær', value: 'primary'},
          {title: 'Sekundær', value: 'secondary'},
          {title: 'Utkant', value: 'outline'},
          {title: 'Tekst-lenke', value: 'link'},
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'string',
      group: 'settings',
      description: 'Størrelse på knappen',
      options: {
        list: [
          {title: 'Liten', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Stor', value: 'large'},
          {title: 'Ekstra stor', value: 'xl'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      group: 'settings',
      description: 'Valgfritt ikon som vises ved siden av teksten',
      options: {
        list: [
          {title: 'Ingen', value: 'none'},
          {title: 'Pil høyre →', value: 'arrow-right'},
          {title: 'Ekstern lenke ↗', value: 'external-link'},
          {title: 'Nedlasting ↓', value: 'download'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'iconPosition',
      title: 'Ikon posisjon',
      type: 'string',
      group: 'settings',
      description: 'Hvor ikonet skal plasseres',
      hidden: ({parent}) => !parent?.icon || parent?.icon === 'none',
      options: {
        list: [
          {title: 'Før tekst', value: 'before'},
          {title: 'Etter tekst', value: 'after'},
        ],
      },
      initialValue: 'after',
    }),
    defineField({
      name: 'fullWidth',
      title: 'Full bredde',
      type: 'boolean',
      group: 'settings',
      description: 'Strekk knappen over full container-bredde',
      initialValue: false,
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      group: 'settings',
      description: 'Åpne lenken i en ny fane',
      initialValue: false,
    }),
  ], {
    includeSpacing: true,
    includeTheme: true,
  }),
  preview: {
    select: {
      title: 'text',
      style: 'style',
      size: 'size',
      icon: 'icon',
      theme: 'theme.variant',
    },
    prepare({title, style, size, icon, theme}) {
      const iconText = icon && icon !== 'none' ? ` • ${icon}` : ''
      const themeText = theme && theme !== 'default' ? ` • ${theme}` : ''
      
      return {
        title: title || 'Knapp uten tekst',
        subtitle: `${style || 'primary'} • ${size || 'medium'}${iconText}${themeText}`,
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
  icon?: string
  iconPosition?: string
  fullWidth?: boolean
  openInNewTab?: boolean
}): string {
  if (!data.text) {
    return ''
  }

  const escapedText = escapeHtml(data.text)
  const escapedUrl = data.url ? escapeHtml(data.url) : '#'
  
  // Build class list
  const classes = [
    'btn',
    `btn-${data.style || 'primary'}`,
    `btn-${data.size || 'medium'}`,
  ]
  
  if (data.fullWidth) classes.push('btn-full-width')
  
  // Icon HTML
  let iconHtml = ''
  if (data.icon && data.icon !== 'none') {
    const iconClass = `icon-${data.icon}`
    iconHtml = `<span class="${iconClass}" aria-hidden="true"></span>`
  }
  
  // Content with icon positioning
  let contentHtml = escapedText
  if (iconHtml) {
    contentHtml = data.iconPosition === 'before' 
      ? `${iconHtml} ${escapedText}`
      : `${escapedText} ${iconHtml}`
  }
  
  // Build attributes
  const attributes = [
    `href="${escapedUrl}"`,
    `class="${classes.join(' ')}"`,
  ]
  
  if (data.openInNewTab || (data.url && data.url.startsWith('http'))) {
    attributes.push('target="_blank"')
    attributes.push('rel="noopener noreferrer"')
  }

  return `<a ${attributes.join(' ')}>${contentHtml}</a>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
