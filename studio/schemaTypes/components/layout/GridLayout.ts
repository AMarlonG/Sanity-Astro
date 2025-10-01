import {defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'
import {componentValidation, contentValidation} from '../../shared/validation'
import type {GridLayoutData, ComponentHTMLGenerator, ValidationRule} from '../../shared/types'

export const gridLayout = defineType({
  name: 'gridLayout',
  title: 'Grid Layout (Avansert)',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Avansert CSS Grid layout med full kontroll over plassering',
  groups: [
    {
      name: 'grid',
      title: 'Grid Setup',
      default: true,
    },
    {
      name: 'responsive',
      title: 'Responsive',
    },
    {
      name: 'spacing',
      title: 'Avstand',
    },
  ],
  fields: [
    // Grid Template
    defineField({
      name: 'gridTemplate',
      title: 'Grid Template',
      type: 'string',
      group: 'grid',
      description: 'Forhåndsdefinerte grid-maler',
      options: {
        list: [
          {title: 'Hero (stor + to små)', value: 'hero'},
          {title: 'Magazine (asymmetrisk)', value: 'magazine'},
          {title: 'Masonry (pinterest-stil)', value: 'masonry'},
          {title: 'Egendefinert', value: 'custom'},
        ],
      },
      initialValue: 'hero',
    }),

    // Custom Grid Areas (only shown for custom template)
    defineField({
      name: 'gridAreas',
      title: 'Grid Areas',
      type: 'text',
      group: 'grid',
      description: 'CSS grid-template-areas (f.eks: "header header" "sidebar main")',
      hidden: ({parent}) => parent?.gridTemplate !== 'custom',
      rows: 4,
    }),

    // Items with specific placement
    defineField({
      name: 'gridItems',
      title: 'Grid Items',
      type: 'array',
      group: 'grid',
      description: 'Komponenter med spesifisert plassering i grid',
      of: [
        {
          type: 'object',
          name: 'gridItem',
          title: 'Grid Item',
          fields: [
            defineField({
              name: 'component',
              title: 'Komponent',
              type: 'array',
              of: [
                {type: 'title'},
                {type: 'headingComponent'},
                {type: 'portableTextBlock'},
                {type: 'quoteComponent'},
                {type: 'imageComponent'},
                {type: 'videoComponent'},
                {type: 'buttonComponent'},
                {type: 'linkComponent'},
              ],
              validation: contentValidation.gridLayoutItems,
            }),
            defineField({
              name: 'gridArea',
              title: 'Grid Area',
              type: 'string',
              description: 'CSS grid-area navn (f.eks: "header", "main", "sidebar")',
              hidden: ({parent}) => {
                const gridTemplate = parent?._parent?.gridTemplate
                return gridTemplate !== 'custom'
              },
            }),
            defineField({
              name: 'span',
              title: 'Span (størrelse)',
              type: 'object',
              description: 'Hvor mange kolonner/rader item skal spenne over',
              hidden: ({parent}) => {
                const gridTemplate = parent?._parent?.gridTemplate
                return gridTemplate === 'custom'
              },
              fields: [
                defineField({
                  name: 'columns',
                  title: 'Kolonner',
                  type: 'number',
                  initialValue: 1,
                  validation: componentValidation.positiveNumber,
                }),
                defineField({
                  name: 'rows',
                  title: 'Rader',
                  type: 'number',
                  initialValue: 1,
                  validation: componentValidation.positiveNumber,
                }),
              ],
            }),
          ],
          preview: {
            select: {
              gridArea: 'gridArea',
              spanColumns: 'span.columns',
              spanRows: 'span.rows',
              component: 'component.0',
            },
            prepare({gridArea, spanColumns, spanRows, component}) {
              const componentName = component?._type || 'Ingen komponent'
              const placement = gridArea || `${spanColumns || 1}×${spanRows || 1}`
              
              return {
                title: componentName,
                subtitle: `Grid: ${placement}`,
                media: BlockElementIcon,
              }
            },
          },
        },
      ],
      validation: contentValidation.gridLayoutItems,
    }),

    // Responsive breakpoints
    defineField({
      name: 'responsiveGrid',
      title: 'Responsive Grid',
      type: 'object',
      group: 'responsive',
      description: 'Hvordan grid oppfører seg på mindre skjermer',
      fields: [
        defineField({
          name: 'tabletBehavior',
          title: 'Tablet oppførsel',
          type: 'string',
          options: {
            list: [
              {title: 'Behold grid', value: 'keep'},
              {title: 'To kolonner', value: 'two-columns'},
              {title: 'En kolonne (stack)', value: 'stack'},
            ],
          },
          initialValue: 'two-columns',
        }),
        defineField({
          name: 'mobileBehavior',
          title: 'Mobil oppførsel',
          type: 'string',
          options: {
            list: [
              {title: 'En kolonne (stack)', value: 'stack'},
              {title: 'To kolonner', value: 'two-columns'},
            ],
          },
          initialValue: 'stack',
        }),
      ],
    }),

    // Spacing
    defineField({
      name: 'gap',
      title: 'Grid Gap',
      type: 'object',
      group: 'spacing',
      fields: [
        defineField({
          name: 'desktop',
          title: 'Desktop',
          type: 'string',
          options: {
            list: [
              {title: 'Liten (1rem)', value: 'small'},
              {title: 'Medium (2rem)', value: 'medium'},
              {title: 'Stor (3rem)', value: 'large'},
              {title: 'Ekstra stor (4rem)', value: 'xl'},
            ],
          },
          initialValue: 'medium',
        }),
        defineField({
          name: 'mobile',
          title: 'Mobil',
          type: 'string',
          options: {
            list: [
              {title: 'Liten (0.5rem)', value: 'small'},
              {title: 'Medium (1rem)', value: 'medium'},
              {title: 'Stor (1.5rem)', value: 'large'},
            ],
          },
          initialValue: 'medium',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      gridTemplate: 'gridTemplate',
      itemCount: 'gridItems.length',
    },
    prepare({gridTemplate, itemCount}) {
      const templateName = 
        gridTemplate === 'hero' ? 'Hero Layout' :
        gridTemplate === 'magazine' ? 'Magazine Layout' :
        gridTemplate === 'masonry' ? 'Masonry Layout' :
        'Custom Grid'
      
      return {
        title: 'Grid',
        subtitle: `${templateName} • ${itemCount || 0} grid items`,
        media: BlockElementIcon,
      }
    },
  },
})

// Generate CSS classes for predefined grid templates
export const gridTemplateCSS = `
/* Hero Layout */
.grid-template-hero {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 
    "main sidebar1"
    "main sidebar2";
}

.grid-template-hero .grid-item:nth-child(1) { grid-area: main; }
.grid-template-hero .grid-item:nth-child(2) { grid-area: sidebar1; }
.grid-template-hero .grid-item:nth-child(3) { grid-area: sidebar2; }

/* Magazine Layout */
.grid-template-magazine {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: 
    "header header aside"
    "content content aside";
}

.grid-template-magazine .grid-item:nth-child(1) { grid-area: header; }
.grid-template-magazine .grid-item:nth-child(2) { grid-area: content; }
.grid-template-magazine .grid-item:nth-child(3) { grid-area: aside; }

/* Masonry Layout */
.grid-template-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: minmax(200px, auto);
}

/* Responsive behavior */
@media (max-width: 768px) {
  .grid-template-hero,
  .grid-template-magazine {
    grid-template-columns: 1fr !important;
    grid-template-areas: none !important;
  }

  .grid-template-hero .grid-item,
  .grid-template-magazine .grid-item {
    grid-area: auto !important;
  }
}
`

// Function to generate HTML from grid layout data
export const generateGridLayoutHtml: ComponentHTMLGenerator<GridLayoutData> = (data: GridLayoutData): string => {
  if (!data.gridItems || data.gridItems.length === 0) {
    return ''
  }

  const templateClass = `grid-template-${data.gridTemplate}`
  const gapClass = `gap-${data.gap?.desktop || 'medium'}`
  const mobileGapClass = `gap-mobile-${data.gap?.mobile || 'medium'}`

  let html = `<div class="grid-layout ${templateClass} ${gapClass} ${mobileGapClass}"`

  // Add custom grid areas for custom template
  if (data.gridTemplate === 'custom' && data.gridAreas) {
    const escapedGridAreas = escapeHtml(data.gridAreas)
    html += ` style="grid-template-areas: ${escapedGridAreas};"`
  }

  html += '>'

  // Generate grid items
  data.gridItems.forEach((item, index) => {
    let itemClass = 'grid-item'

    if (data.gridTemplate === 'custom' && item.gridArea) {
      html += `\n  <div class="${itemClass}" style="grid-area: ${escapeHtml(item.gridArea)};">`
    } else if (item.span) {
      const spanStyle = `grid-column: span ${item.span.columns || 1}; grid-row: span ${item.span.rows || 1};`
      html += `\n  <div class="${itemClass}" style="${spanStyle}">`
    } else {
      html += `\n  <div class="${itemClass}">`
    }

    // Add component content (simplified - in real implementation would render components)
    if (item.component && item.component.length > 0) {
      html += `\n    <!-- Grid item ${index + 1} components would be rendered here -->`
      html += `\n    <div class="grid-item-content">`
      html += `\n      <!-- Component type: ${item.component[0]?._type || 'unknown'} -->`
      html += `\n    </div>`
    }

    html += `\n  </div>`
  })

  html += '\n</div>'
  return html
}

// HTML escape utility function
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Type-safe validation functions
export const gridLayoutValidationRules = {
  gridTemplate: componentValidation.title as ValidationRule,
  gridItems: contentValidation.gridLayoutItems as ValidationRule,
} as const

// Utility function to validate grid layout has content
export function hasValidGridLayoutContent(data: GridLayoutData): boolean {
  return !!(data.gridItems && data.gridItems.length > 0)
}

// Utility function to get grid item count
export function getGridItemCount(data: GridLayoutData): number {
  return data.gridItems?.length || 0
}

// Utility function to generate CSS grid template areas
export function generateGridTemplateAreas(data: GridLayoutData): string {
  if (data.gridTemplate === 'custom' && data.gridAreas) {
    return data.gridAreas
  }

  // Return predefined template areas
  switch (data.gridTemplate) {
    case 'hero':
      return '"main sidebar1" "main sidebar2"'
    case 'magazine':
      return '"header header aside" "content content aside"'
    case 'masonry':
      return '' // Masonry doesn't use template areas
    default:
      return ''
  }
}

// Utility function to check if grid template supports custom areas
export function supportsCustomAreas(template: string): boolean {
  return template === 'custom'
}

// Utility function to get responsive grid classes
export function getResponsiveGridClasses(data: GridLayoutData): string[] {
  const classes: string[] = []

  if (data.responsiveGrid?.tabletBehavior) {
    classes.push(`tablet-${data.responsiveGrid.tabletBehavior}`)
  }

  if (data.responsiveGrid?.mobileBehavior) {
    classes.push(`mobile-${data.responsiveGrid.mobileBehavior}`)
  }

  return classes
}