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
            {
              name: 'isOpen',
              title: 'Åpent som standard',
              type: 'boolean',
              description: 'Panelet er åpent når siden lastes',
              initialValue: false,
            },
            {
              name: 'icon',
              title: 'Ikon',
              type: 'string',
              description: 'Valgfritt ikon for panelet',
              options: {
                list: [
                  {title: 'Ingen', value: ''},
                  {title: 'Informasjon', value: 'info'},
                  {title: 'Spørsmål', value: 'question'},
                  {title: 'Advarsel', value: 'warning'},
                  {title: 'Sjekk', value: 'check'},
                  {title: 'Pil', value: 'arrow'},
                ],
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              isOpen: 'isOpen',
            },
            prepare({title, isOpen}) {
              return {
                title: title || 'Panel uten tittel',
                subtitle: isOpen ? 'Åpent som standard' : 'Lukket som standard',
                media: TiersIcon,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'style',
      title: 'Stil',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'default'},
          {title: 'Bordered', value: 'bordered'},
          {title: 'Card', value: 'card'},
          {title: 'Minimal', value: 'minimal'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'behavior',
      title: 'Oppførsel',
      type: 'string',
      options: {
        list: [
          {title: 'Kun ett panel åpent', value: 'single'},
          {title: 'Flere paneler kan være åpne', value: 'multiple'},
        ],
      },
      initialValue: 'single',
      description: 'Bestemmer om kun ett eller flere paneler kan være åpne samtidig',
    }),
    defineField({
      name: 'animation',
      title: 'Animasjon',
      type: 'string',
      options: {
        list: [
          {title: 'Slide', value: 'slide'},
          {title: 'Fade', value: 'fade'},
          {title: 'Ingen', value: 'none'},
        ],
      },
      initialValue: 'slide',
      description: 'Animasjonstype når paneler åpnes/lukkes',
    }),
    defineField({
      name: 'iconPosition',
      title: 'Ikonposisjon',
      type: 'string',
      options: {
        list: [
          {title: 'Venstre', value: 'left'},
          {title: 'Høyre', value: 'right'},
        ],
      },
      initialValue: 'right',
      description: 'Hvor chevron-ikonet plasseres',
    }),
    defineField({
      name: 'accessibility',
      title: 'Tilgjengelighet',
      type: 'object',
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
      style: 'style',
    },
    prepare({title, panelCount, style}) {
      const count = panelCount?.length || 0
      return {
        title: title || 'Accordion uten tittel',
        subtitle: `${count} panel${count !== 1 ? 'er' : ''} • ${style}`,
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
    isOpen: boolean
    icon?: string
  }>
  style: string
  behavior: string
  animation: string
  iconPosition: string
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
  }
}): string {
  if (!data.title || !data.panels || data.panels.length === 0) {
    return ''
  }

  const escapedTitle = escapeHtml(data.title)
  const escapedDescription = data.description ? escapeHtml(data.description) : ''
  const styleClass = `accordion-${data.style}`
  const behaviorClass = `accordion-${data.behavior}`
  const animationClass = `accordion-${data.animation}`
  const iconPositionClass = `accordion-icon-${data.iconPosition}`

  let html = `<div class="accordion ${styleClass} ${behaviorClass} ${animationClass} ${iconPositionClass}"`

  if (data.accessibility?.ariaLabel) {
    html += ` aria-label="${escapeHtml(data.accessibility.ariaLabel)}"`
  }
  if (data.accessibility?.ariaDescribedBy) {
    html += ` aria-describedby="${escapeHtml(data.accessibility.ariaDescribedBy)}"`
  }

  html += '>'

  // Hovedtittel
  if (escapedTitle) {
    html += `\n  <h2 class="accordion-title">${escapedTitle}</h2>`
  }

  // Beskrivelse
  if (escapedDescription) {
    html += `\n  <p class="accordion-description">${escapedDescription}</p>`
  }

  // Paneler
  html += '\n  <div class="accordion-panels">'

  data.panels.forEach((panel, index) => {
    const panelId = `accordion-panel-${index}`
    const buttonId = `accordion-button-${index}`
    const isOpen = panel.isOpen ? 'true' : 'false'
    const expanded = panel.isOpen ? 'true' : 'false'
    const hidden = panel.isOpen ? 'false' : 'true'

    const escapedPanelTitle = escapeHtml(panel.title)
    const iconClass = panel.icon ? `panel-icon-${panel.icon}` : ''

    html += `\n    <div class="accordion-panel" id="${panelId}">`
    html += `\n      <button class="accordion-trigger ${iconClass}" id="${buttonId}" aria-expanded="${expanded}" aria-controls="${panelId}">`
    html += `\n        <span class="accordion-trigger-text">${escapedPanelTitle}</span>`
    html += `\n        <span class="accordion-icon" aria-hidden="true"></span>`
    html += `\n      </button>`
    html += `\n      <div class="accordion-content" aria-labelledby="${buttonId}" aria-hidden="${hidden}">`

    // Her ville man normalt rendere panel-innholdet
    // For nå legger vi til en placeholder
    if (panel.content && panel.content.length > 0) {
      html += `\n        <div class="accordion-content-inner">`
      html += `\n          <!-- Panel innhold her -->`
      html += `\n        </div>`
    }

    html += `\n      </div>`
    html += `\n    </div>`
  })

  html += '\n  </div>'
  html += '\n</div>'

  return html
}

// Funksjon for å generere JavaScript for accordion-funksjonalitet
export function generateAccordionScript(data: {behavior: string; animation: string}): string {
  const behavior = data.behavior
  const animation = data.animation

  return `
// Accordion JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const triggers = accordion.querySelectorAll('.accordion-trigger');
    const behavior = accordion.classList.contains('accordion-single') ? 'single' : 'multiple';
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const panel = this.closest('.accordion-panel');
        const content = panel.querySelector('.accordion-content');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        if (behavior === 'single' && !isExpanded) {
          // Lukk alle andre paneler
          accordion.querySelectorAll('.accordion-trigger').forEach(otherTrigger => {
            if (otherTrigger !== this) {
              const otherPanel = otherTrigger.closest('.accordion-panel');
              const otherContent = otherPanel.querySelector('.accordion-content');
              
              otherTrigger.setAttribute('aria-expanded', 'false');
              otherContent.setAttribute('aria-hidden', 'true');
              otherPanel.classList.remove('open');
            }
          });
        }
        
        // Toggle current panel
        const newExpanded = !isExpanded;
        this.setAttribute('aria-expanded', newExpanded.toString());
        content.setAttribute('aria-hidden', (!newExpanded).toString());
        panel.classList.toggle('open', newExpanded);
      });
    });
  });
});
`
}

// HTML escape utility function
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
