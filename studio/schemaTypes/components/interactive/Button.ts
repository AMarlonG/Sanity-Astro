import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'
import {buttonURLValidation} from '../../../lib/urlValidation'
import {componentSpecificValidation} from '../../shared/validation'
import type {ButtonData, ComponentHTMLGenerator, ValidationRule} from '../../shared/types'

export const buttonComponent = defineType({
  name: 'buttonComponent',
  title: 'Knapp',
  type: 'object',
  icon: BoltIcon,
  description: 'Opprett knapp for enten lenke eller handling',
  groups: [
    {
      name: 'content',
      title: 'Innhold & Innstillinger',
      default: true,
    },
  ],
  fields: [
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
      group: 'content',
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
      group: 'content',
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
      group: 'content',
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
      group: 'content',
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
      group: 'content',
      description: 'Strekk knappen over full container-bredde',
      initialValue: false,
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      group: 'content',
      description: 'Åpne lenken i en ny fane',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'text',
      style: 'style',
      size: 'size',
      icon: 'icon',
      theme: 'theme.variant',
    },
    prepare({title, style, size, icon, theme}) {
      // Lag realistisk beskrivelse av hvordan knappen ser ut
      const styleDesc = {
        'primary': 'Blå bakgrunn, hvit tekst',
        'secondary': 'Grå bakgrunn, hvit tekst',
        'outline': 'Gjennomsiktig bakgrunn, blå ramme'
      }[style || 'primary'] || 'Blå bakgrunn, hvit tekst'

      const sizeDesc = {
        'small': 'liten',
        'medium': 'medium',
        'large': 'stor'
      }[size || 'medium'] || 'medium'

      const iconText = icon && icon !== 'none' ? ` • ${icon}-ikon` : ''

      return {
        title: 'Knapp',
        subtitle: `${title || 'Uten tekst'} • ${styleDesc} • ${sizeDesc} størrelse${iconText}`,
        media: BoltIcon,
      }
    },
  },
})

// Type-safe validation functions
export const buttonValidationRules = {
  text: componentSpecificValidation.buttonText as ValidationRule,
  url: (Rule: any) => Rule.required().custom(buttonURLValidation) as ValidationRule,
} as const
