import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'
import {buttonURLValidation} from '../../lib/urlValidation'
import {addGlobalFields, designGroup, generateThemeClasses} from '../shared/globalFields'
import {componentSpecificValidation} from '../shared/validation'

export const enhancedButtonComponent = defineType({
  name: 'enhancedButtonComponent',
  title: 'Knapp (Utvidet)',
  type: 'object',
  icon: BoltIcon,
  description: 'Knapp med avanserte design- og animasjonsinnstillinger',
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
      name: 'action',
      title: 'Handling',
      type: 'string',
      group: 'settings',
      description: 'Hva knappen skal gjøre',
      options: {
        list: [
          {title: 'Gå til lenke', value: 'link'},
          {title: 'Skjema', value: 'form'},
          {title: 'Modal', value: 'modal'},
          {title: 'Nedlasting', value: 'download'},
        ],
      },
      initialValue: 'link',
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
      name: 'icon',
      title: 'Ikon',
      type: 'string',
      group: 'settings',
      description: 'Valgfritt ikon som vises ved siden av teksten',
      options: {
        list: [
          {title: 'Ingen', value: 'none'},
          {title: 'Pil høyre →', value: 'arrow-right'},
          {title: 'Pil ned ↓', value: 'arrow-down'},
          {title: 'Ekstern lenke ↗', value: 'external-link'},
          {title: 'Nedlasting ↓', value: 'download'},
          {title: 'Play ▶', value: 'play'},
          {title: 'E-post ✉', value: 'email'},
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
      hidden: ({parent}) => parent?.icon === 'none',
      options: {
        list: [
          {title: 'Før tekst', value: 'before'},
          {title: 'Etter tekst', value: 'after'},
        ],
      },
      initialValue: 'after',
    }),
    defineField({
      name: 'disabled',
      title: 'Deaktivert',
      type: 'boolean',
      group: 'settings',
      description: 'Om knappen skal være deaktivert',
      initialValue: false,
    }),
    defineField({
      name: 'fullWidth',
      title: 'Full bredde',
      type: 'boolean',
      group: 'settings',
      description: 'Strekk knappen over full container-bredde',
      initialValue: false,
    }),
  ], {
    includeSpacing: true,
    includeTheme: true,
    includeAnimation: true,
  }),
  preview: {
    select: {
      title: 'text',
      style: 'style',
      size: 'size',
      action: 'action',
      disabled: 'disabled',
      theme: 'theme.variant',
    },
    prepare({title, style, size, action, disabled, theme}) {
      const statusText = disabled ? ' (deaktivert)' : ''
      const themeText = theme && theme !== 'default' ? ` • ${theme}` : ''
      
      return {
        title: title || 'Knapp uten tekst',
        subtitle: `${style} • ${size} • ${action}${themeText}${statusText}`,
        media: BoltIcon,
      }
    },
  },
})

// Enhanced HTML generation with theme support
export function generateEnhancedButtonHtml(data: {
  text: string
  url?: string
  style?: string
  size?: string
  action?: string
  icon?: string
  iconPosition?: string
  disabled?: boolean
  fullWidth?: boolean
  spacing?: any
  theme?: any
  animation?: any
}): string {
  if (!data.text) {
    return ''
  }

  const escapedText = escapeHtml(data.text)
  const escapedUrl = data.url ? escapeHtml(data.url) : '#'
  
  // Generate theme classes
  const themeClasses = generateThemeClasses({
    spacing: data.spacing,
    theme: data.theme,
    animation: data.animation,
  })

  // Base button classes
  const buttonClasses = [
    'btn',
    `btn-${data.style || 'primary'}`,
    `btn-${data.size || 'medium'}`,
    ...themeClasses,
  ]

  if (data.fullWidth) buttonClasses.push('btn-full-width')
  if (data.disabled) buttonClasses.push('btn-disabled')

  // Icon generation
  let iconHtml = ''
  if (data.icon && data.icon !== 'none') {
    const iconClass = `icon-${data.icon}`
    iconHtml = `<span class="${iconClass}" aria-hidden="true"></span>`
  }

  // Content with icon positioning
  let contentHtml = escapedText
  if (iconHtml) {
    contentHtml = data.iconPosition === 'before' 
      ? `${iconHtml}${escapedText}`
      : `${escapedText}${iconHtml}`
  }

  // Generate attributes
  const attributes = [
    `href="${escapedUrl}"`,
    `class="${buttonClasses.join(' ')}"`,
  ]

  if (data.disabled) attributes.push('disabled')
  if (data.action === 'download') attributes.push('download')
  if (data.url && data.url.startsWith('http')) {
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

// Enhanced CSS for the button system
export const enhancedButtonCSS = `
/* === BASE BUTTON STYLES === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  line-height: 1.5;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

/* === BUTTON STYLES === */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-secondary);
  color: white;
  border-color: var(--color-secondary);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: white;
}

.btn-link {
  background: transparent;
  color: var(--color-primary);
  border: none;
  text-decoration: underline;
  padding: 0.25rem 0.5rem;
}

/* === BUTTON SIZES === */
.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn-xl {
  padding: 1rem 2rem;
  font-size: 1.25rem;
}

/* === BUTTON MODIFIERS === */
.btn-full-width {
  width: 100%;
}

.btn-disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* === ICONS === */
.btn .icon-arrow-right::before { content: '→'; }
.btn .icon-arrow-down::before { content: '↓'; }
.btn .icon-external-link::before { content: '↗'; }
.btn .icon-download::before { content: '⬇'; }
.btn .icon-play::before { content: '▶'; }
.btn .icon-email::before { content: '✉'; }

/* Icon spacing */
.btn > *:not(:last-child) {
  margin-right: 0.5rem;
}
`