import {defineField, defineType} from 'sanity'
import {EllipsisHorizontalIcon} from '@sanity/icons'

export const columnLayout = defineType({
  name: 'columnLayout',
  title: 'Responsiv Layout',
  type: 'object',
  icon: EllipsisHorizontalIcon,
  description: 'Opprett responsive layouts som fungerer på alle skjermstørrelser',
  groups: [
    {
      name: 'layout',
      title: 'Layout',
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
    {
      name: 'alignment',
      title: 'Justering',
    },
  ],
  fields: [
    // Layout Type
    defineField({
      name: 'layoutType',
      title: 'Layout Type',
      type: 'string',
      group: 'layout',
      description: 'Velg grunnleggende layout-mønster',
      options: {
        list: [
          {title: 'Kolonner (CSS Grid)', value: 'columns'},
          {title: 'Flexbox', value: 'flexbox'},
          {title: 'Stack (vertikal)', value: 'stack'},
        ],
      },
      initialValue: 'columns',
      validation: (Rule) => Rule.required(),
    }),

    // Desktop Layout
    defineField({
      name: 'desktopColumns',
      title: 'Desktop Kolonner',
      type: 'string',
      group: 'responsive',
      description: 'Antall kolonner på desktop (>768px)',
      hidden: ({parent}) => parent?.layoutType !== 'columns',
      options: {
        list: [
          {title: '1 kolonne', value: '1'},
          {title: '2 kolonner', value: '2'},
          {title: '3 kolonner', value: '3'},
          {title: '4 kolonner', value: '4'},
          {title: '5 kolonner', value: '5'},
          {title: '6 kolonner', value: '6'},
        ],
      },
      initialValue: '2',
    }),

    // Tablet Layout
    defineField({
      name: 'tabletColumns',
      title: 'Tablet Kolonner',
      type: 'string',
      group: 'responsive',
      description: 'Antall kolonner på tablet (481-768px)',
      hidden: ({parent}) => parent?.layoutType !== 'columns',
      options: {
        list: [
          {title: '1 kolonne', value: '1'},
          {title: '2 kolonner', value: '2'},
          {title: '3 kolonner', value: '3'},
        ],
      },
      initialValue: '2',
    }),

    // Mobile Layout
    defineField({
      name: 'mobileColumns',
      title: 'Mobil Kolonner',
      type: 'string',
      group: 'responsive',
      description: 'Antall kolonner på mobil (<480px)',
      hidden: ({parent}) => parent?.layoutType !== 'columns',
      options: {
        list: [
          {title: '1 kolonne', value: '1'},
          {title: '2 kolonner', value: '2'},
        ],
      },
      initialValue: '1',
    }),

    // Flexbox Direction
    defineField({
      name: 'flexDirection',
      title: 'Flex Retning',
      type: 'string',
      group: 'layout',
      description: 'Retning for flexbox layout',
      hidden: ({parent}) => parent?.layoutType !== 'flexbox',
      options: {
        list: [
          {title: 'Horisontal (row)', value: 'row'},
          {title: 'Vertikal (column)', value: 'column'},
          {title: 'Horisontal omvendt', value: 'row-reverse'},
          {title: 'Vertikal omvendt', value: 'column-reverse'},
        ],
      },
      initialValue: 'row',
    }),

    // Flexbox Wrap
    defineField({
      name: 'flexWrap',
      title: 'Flex Wrap',
      type: 'boolean',
      group: 'layout',
      description: 'Tillat elementer å bryte til neste linje',
      hidden: ({parent}) => parent?.layoutType !== 'flexbox',
      initialValue: true,
    }),

    // Gap Settings
    defineField({
      name: 'gap',
      title: 'Avstand mellom elementer',
      type: 'object',
      group: 'spacing',
      description: 'Kontroller avstand mellom komponenter',
      fields: [
        defineField({
          name: 'desktop',
          title: 'Desktop',
          type: 'string',
          options: {
            list: [
              {title: 'Ingen (0)', value: '0'},
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
              {title: 'Ingen (0)', value: '0'},
              {title: 'Liten (0.5rem)', value: 'small'},
              {title: 'Medium (1rem)', value: 'medium'},
              {title: 'Stor (1.5rem)', value: 'large'},
            ],
          },
          initialValue: 'medium',
        }),
      ],
    }),

    // Alignment Controls
    defineField({
      name: 'alignment',
      title: 'Justering',
      type: 'object',
      group: 'alignment',
      description: 'Kontroller hvordan innhold justeres',
      fields: [
        defineField({
          name: 'horizontal',
          title: 'Horisontal justering',
          type: 'string',
          options: {
            list: [
              {title: 'Start (venstre)', value: 'start'},
              {title: 'Senter', value: 'center'},
              {title: 'End (høyre)', value: 'end'},
              {title: 'Mellomrom mellom', value: 'space-between'},
              {title: 'Jevnt fordelt', value: 'space-around'},
            ],
          },
          initialValue: 'start',
        }),
        defineField({
          name: 'vertical',
          title: 'Vertikal justering',
          type: 'string',
          options: {
            list: [
              {title: 'Start (topp)', value: 'start'},
              {title: 'Senter', value: 'center'},
              {title: 'End (bunn)', value: 'end'},
              {title: 'Stretch (strekk)', value: 'stretch'},
            ],
          },
          initialValue: 'start',
        }),
      ],
    }),

    // Container Settings
    defineField({
      name: 'containerWidth',
      title: 'Container Bredde',
      type: 'string',
      group: 'layout',
      description: 'Maksimal bredde på container',
      options: {
        list: [
          {title: 'Full bredde', value: 'full'},
          {title: 'Container (1200px)', value: 'container'},
          {title: 'Smal (800px)', value: 'narrow'},
          {title: 'Bred (1600px)', value: 'wide'},
        ],
      },
      initialValue: 'full',
    }),

    // Content Items
    defineField({
      name: 'items',
      title: 'Innhold',
      type: 'array',
      group: 'layout',
      description: 'Legg til komponenter som skal organiseres i layout',
      of: [
        {type: 'title'},
        {type: 'headingComponent'},
        {type: 'portableTextBlock'},
        {type: 'quoteComponent'},
        {type: 'imageComponent'},
        {type: 'videoComponent'},
        {type: 'buttonComponent'},
        {type: 'linkComponent'},
        {type: 'accordionComponent'},
        // Scroll containers for sections
        {type: 'contentScrollContainer'},
        {type: 'artistScrollContainer'},
        {type: 'eventScrollContainer'},
      ],
      validation: (Rule) => Rule.min(1).max(12).error('Må ha mellom 1 og 12 komponenter'),
    }),
  ],
  preview: {
    select: {
      layoutType: 'layoutType',
      desktopColumns: 'desktopColumns',
      count: 'items.length',
      containerWidth: 'containerWidth',
    },
    prepare({layoutType, desktopColumns, count, containerWidth}) {
      const layoutName = 
        layoutType === 'columns' ? `${desktopColumns || '2'} kolonne(r)` :
        layoutType === 'flexbox' ? 'Flexbox' :
        'Stack'
      
      return {
        title: `${layoutName} Layout`,
        subtitle: `${count || 0} komponenter • ${containerWidth || 'full'} bredde`,
        media: EllipsisHorizontalIcon,
      }
    },
  },
})

// Generate HTML with proper responsive classes
export function generateColumnLayoutHtml(data: {
  layoutType: string
  desktopColumns?: string
  tabletColumns?: string
  mobileColumns?: string
  flexDirection?: string
  flexWrap?: boolean
  gap?: {desktop: string, mobile: string}
  alignment?: {horizontal: string, vertical: string}
  containerWidth?: string
  items?: any[]
}): string {
  if (!data.items || data.items.length === 0) {
    return ''
  }

  // Build CSS classes based on configuration
  const containerClasses = [
    'responsive-layout',
    `layout-${data.layoutType || 'columns'}`,
    `width-${data.containerWidth || 'full'}`,
  ]

  // Add responsive grid classes
  if (data.layoutType === 'columns') {
    containerClasses.push(`grid-desktop-${data.desktopColumns || '2'}`)
    containerClasses.push(`grid-tablet-${data.tabletColumns || '2'}`)
    containerClasses.push(`grid-mobile-${data.mobileColumns || '1'}`)
  }

  // Add flexbox classes
  if (data.layoutType === 'flexbox') {
    containerClasses.push(`flex-${data.flexDirection || 'row'}`)
    if (data.flexWrap) containerClasses.push('flex-wrap')
  }

  // Add gap classes
  if (data.gap) {
    containerClasses.push(`gap-desktop-${data.gap.desktop || 'medium'}`)
    containerClasses.push(`gap-mobile-${data.gap.mobile || 'medium'}`)
  }

  // Add alignment classes
  if (data.alignment) {
    containerClasses.push(`justify-${data.alignment.horizontal || 'start'}`)
    containerClasses.push(`align-${data.alignment.vertical || 'start'}`)
  }

  // Generate items HTML
  const itemsHtml = data.items.map((item, index) => {
    let itemHtml = ''
    
    // Import and use appropriate component generators
    switch (item._type) {
      case 'title':
        const {generateTitleHtml} = require('./Title')
        itemHtml = generateTitleHtml(item)
        break
      case 'headingComponent':
        const {generateHeadingHtml} = require('./Heading')
        itemHtml = generateHeadingHtml(item)
        break
      case 'imageComponent':
        const {generateImageHtml} = require('./Image')
        itemHtml = generateImageHtml(item)
        break
      case 'videoComponent':
        const {generateVideoHtml} = require('./Video')
        itemHtml = generateVideoHtml(item)
        break
      case 'buttonComponent':
        const {generateButtonHtml} = require('./Button')
        itemHtml = generateButtonHtml(item)
        break
      case 'quoteComponent':
        const {generateQuoteHtml} = require('./Quote')
        itemHtml = generateQuoteHtml(item)
        break
      // Add other component types as needed
      default:
        itemHtml = `<div class="component-placeholder">Unsupported component: ${item._type}</div>`
    }

    return `<div class="layout-item" data-index="${index}">${itemHtml}</div>`
  }).join('\n')

  return `
<div class="${containerClasses.join(' ')}">
  ${itemsHtml}
</div>`
}

// CSS utility classes that should be added to your frontend
export const responsiveLayoutCSS = `
.responsive-layout {
  container-type: inline-size;
}

/* Grid Layout */
.layout-columns {
  display: grid;
  width: 100%;
}

/* Desktop grid columns */
.grid-desktop-1 { grid-template-columns: 1fr; }
.grid-desktop-2 { grid-template-columns: repeat(2, 1fr); }
.grid-desktop-3 { grid-template-columns: repeat(3, 1fr); }
.grid-desktop-4 { grid-template-columns: repeat(4, 1fr); }
.grid-desktop-5 { grid-template-columns: repeat(5, 1fr); }
.grid-desktop-6 { grid-template-columns: repeat(6, 1fr); }

/* Tablet responsive */
@container (max-width: 768px) {
  .grid-tablet-1 { grid-template-columns: 1fr !important; }
  .grid-tablet-2 { grid-template-columns: repeat(2, 1fr) !important; }
  .grid-tablet-3 { grid-template-columns: repeat(3, 1fr) !important; }
}

/* Mobile responsive */
@container (max-width: 480px) {
  .grid-mobile-1 { grid-template-columns: 1fr !important; }
  .grid-mobile-2 { grid-template-columns: repeat(2, 1fr) !important; }
}

/* Flexbox Layout */
.layout-flexbox {
  display: flex;
}

.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }
.flex-row-reverse { flex-direction: row-reverse; }
.flex-column-reverse { flex-direction: column-reverse; }
.flex-wrap { flex-wrap: wrap; }

/* Stack Layout */
.layout-stack {
  display: flex;
  flex-direction: column;
}

/* Gap Settings */
.gap-desktop-0 { gap: 0; }
.gap-desktop-small { gap: 1rem; }
.gap-desktop-medium { gap: 2rem; }
.gap-desktop-large { gap: 3rem; }
.gap-desktop-xl { gap: 4rem; }

@container (max-width: 768px) {
  .gap-mobile-0 { gap: 0 !important; }
  .gap-mobile-small { gap: 0.5rem !important; }
  .gap-mobile-medium { gap: 1rem !important; }
  .gap-mobile-large { gap: 1.5rem !important; }
}

/* Alignment */
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-space-between { justify-content: space-between; }
.justify-space-around { justify-content: space-around; }

.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }
.align-stretch { align-items: stretch; }

/* Container Widths */
.width-full { max-width: 100%; }
.width-container { max-width: 1200px; margin: 0 auto; }
.width-narrow { max-width: 800px; margin: 0 auto; }
.width-wide { max-width: 1600px; margin: 0 auto; }

/* Layout Item */
.layout-item {
  min-width: 0; /* Prevents flex/grid overflow */
}
`