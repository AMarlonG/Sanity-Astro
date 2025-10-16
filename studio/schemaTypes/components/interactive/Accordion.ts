import {defineField, defineType} from 'sanity'
import {DocumentIcon, TiersIcon} from '@sanity/icons'
import {generateQuoteHtml} from '../content/Quote'
import {componentValidation, contentValidation} from '../../shared/validation'
import type {AccordionData, ComponentHTMLGenerator, ValidationRule} from '../../shared/types'

export const accordionComponent = defineType({
  name: 'accordionComponent',
  title: 'Nedtrekksmeny',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Hovedtittel for nedtrekksmenyen',
      validation: componentValidation.title,
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      description: 'Valgfri beskrivelse som vises over nedtrekksmenyen',
    }),
    defineField({
      name: 'panels',
      title: 'Paneler',
      type: 'array',
      description: 'Lag seksjoner som kan klikkes for å åpne og lukke innhold',
      validation: contentValidation.accordionPanels,
      of: [
        {
          type: 'object',
          name: 'accordionPanel',
          title: 'Panel',
          fields: [
            {
              name: 'title',
              title: 'Panel-tittel',
              type: 'string',
              validation: componentValidation.title,
            },
            {
              name: 'content',
              title: 'Innhold',
              type: 'array',
              description: 'Innholdet som vises når panelet er åpent',
              of: [
                {type: 'block'},
                {type: 'imageComponent'},
                {type: 'videoComponent'},
                {type: 'buttonComponent'},
                {type: 'title'},
                {type: 'quoteComponent'},
                {type: 'headingComponent'},
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({title}) {
              return {
                title: title || 'Panel uten tittel',
                subtitle: 'Accordion panel',
                media: TiersIcon,
              }
            },
          },
        },
      ],
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
          description: 'Beskrivende tekst for skjermlesere',
        },
        {
          name: 'ariaDescribedBy',
          title: 'ARIA Described By',
          type: 'string',
          description: 'ID til element som beskriver accordion',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      panelCount: 'panels',
    },
    prepare({title, panelCount}) {
      const count = panelCount?.length || 0
      return {
        title: 'Nedtrekksmeny',
        subtitle: `${title || 'Uten tittel'} • ${count} panel${count !== 1 ? 'er' : ''}`,
        media: TiersIcon,
      }
    },
  },
})

// Type-safe validation functions
export const accordionValidationRules = {
  title: componentValidation.title as ValidationRule,
  panels: contentValidation.accordionPanels as ValidationRule,
} as const

// Utility function to validate accordion has required content
export function hasValidAccordionContent(data: AccordionData): boolean {
  return !!(data.title && data.panels && data.panels.length > 0)
}

// Utility function to get accordion panel count
export function getAccordionPanelCount(data: AccordionData): number {
  return data.panels?.length || 0
}

// Utility function to generate unique IDs for accordion panels
export function generateAccordionIds(baseId: string, panelCount: number): Array<{panelId: string; buttonId: string}> {
  return Array.from({length: panelCount}, (_, index) => ({
    panelId: `${baseId}-panel-${index}`,
    buttonId: `${baseId}-button-${index}`,
  }))
}
