import {defineField, defineType} from 'sanity'
import {DocumentIcon, TiersIcon} from '@sanity/icons'

export const accordionComponentType = defineType({
  name: 'accordionComponent',
  title: 'Sammenleggbar seksjon',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Hovedtittel for accordion-komponenten',
      validation: (Rule) => Rule.required().error('Tittel er påkrevd'),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      description: 'Valgfri beskrivelse som vises over accordion-panelene',
    }),
    defineField({
      name: 'panels',
      title: 'Paneler',
      type: 'array',
      description: 'Legg til accordion-paneler',
      validation: (Rule) => Rule.required().min(1).error('Minst ett panel er påkrevd'),
      of: [
        {
          type: 'object',
          name: 'accordionPanel',
          title: 'Accordion Panel',
          fields: [
            {
              name: 'title',
              title: 'Panel-tittel',
              type: 'string',
              validation: (Rule) => Rule.required().error('Panel-tittel er påkrevd'),
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
                {type: 'quotes'},
                {type: 'headings'},
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
        title: title || 'Accordion uten tittel',
        subtitle: `${count} panel${count !== 1 ? 'er' : ''}`,
        media: TiersIcon,
      }
    },
  },
})

// Funksjon for å generere HTML fra accordion-data
export function generateAccordionHtml(data: {
  title: string
  description?: string
  panels: Array<{
    title: string
    content: any[]
  }>
}): string {
  if (!data.title || !data.panels || data.panels.length === 0) {
    return ''
  }

  const escapedTitle = escapeHtml(data.title)
  const escapedDescription = data.description ? escapeHtml(data.description) : ''

  let html = '<div class="accordion">'

  if (escapedTitle) {
    html += `\n  <h2 class="accordion-title">${escapedTitle}</h2>`
  }

  if (escapedDescription) {
    html += `\n  <p class="accordion-description">${escapedDescription}</p>`
  }

  html += '\n  <div class="accordion-panels">'

    data.panels.forEach((panel, index) => {
    const escapedPanelTitle = escapeHtml(panel.title)
    const panelId = `panel-${index}`
    const buttonId = `button-${index}`

    html += `\n    <div class="accordion-panel">`
    html += `\n      <button class="accordion-button" id="${buttonId}" aria-expanded="false" aria-controls="${panelId}">`
    html += `\n        <span class="accordion-button-text">${escapedPanelTitle}</span>`
    html += `\n        <span class="accordion-icon" aria-hidden="true"></span>`
    html += `\n      </button>`
    html += `\n      <div class="accordion-content" id="${panelId}" aria-labelledby="${buttonId}" aria-hidden="true">`
    
    // Her kan du legge til logikk for å generere innhold fra panel.content
    html += `\n        <div class="panel-content">Innhold kommer her</div>`
    
    html += `\n      </div>`
    html += `\n    </div>`
  })

  html += '\n  </div>'
  html += '\n</div>'

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
