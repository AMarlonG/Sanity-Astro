import {defineField, defineType} from 'sanity'
import {ExpandIcon} from '@sanity/icons'

export const spacer = defineType({
  name: 'spacer',
  title: 'Spacing/Avstand',
  type: 'object',
  icon: ExpandIcon,
  description: 'Legg til vertikal eller horisontal avstand mellom komponenter',
  fields: [
    defineField({
      name: 'type',
      title: 'Type avstand',
      type: 'string',
      description: 'Velg type avstand',
      options: {
        list: [
          {title: 'Vertikal avstand', value: 'vertical'},
          {title: 'Horisontal avstand', value: 'horizontal'},
          {title: 'Seksjonsskille', value: 'section'},
        ],
      },
      initialValue: 'vertical',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'size',
      title: 'Størrelse',
      type: 'object',
      description: 'Responsiv størrelse på avstand',
      fields: [
        defineField({
          name: 'desktop',
          title: 'Desktop',
          type: 'string',
          options: {
            list: [
              {title: 'Ekstra liten (0.5rem)', value: 'xs'},
              {title: 'Liten (1rem)', value: 'small'},
              {title: 'Medium (2rem)', value: 'medium'},
              {title: 'Stor (3rem)', value: 'large'},
              {title: 'Ekstra stor (4rem)', value: 'xl'},
              {title: 'Dobbelt stor (6rem)', value: 'xxl'},
              {title: 'Gigantisk (8rem)', value: 'xxxl'},
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
              {title: 'Ekstra liten (0.25rem)', value: 'xs'},
              {title: 'Liten (0.5rem)', value: 'small'},
              {title: 'Medium (1rem)', value: 'medium'},
              {title: 'Stor (1.5rem)', value: 'large'},
              {title: 'Ekstra stor (2rem)', value: 'xl'},
              {title: 'Dobbelt stor (3rem)', value: 'xxl'},
            ],
          },
          initialValue: 'medium',
        }),
      ],
    }),

    defineField({
      name: 'showDivider',
      title: 'Vis skillelinje',
      type: 'boolean',
      description: 'Vis en tynn skillelinje (kun for seksjonsskille)',
      hidden: ({parent}) => parent?.type !== 'section',
      initialValue: false,
    }),

    defineField({
      name: 'dividerStyle',
      title: 'Skillelinje stil',
      type: 'string',
      description: 'Stil på skillelinje',
      hidden: ({parent}) => parent?.type !== 'section' || !parent?.showDivider,
      options: {
        list: [
          {title: 'Solid linje', value: 'solid'},
          {title: 'Stiplet linje', value: 'dashed'},
          {title: 'Prikket linje', value: 'dotted'},
        ],
      },
      initialValue: 'solid',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      desktopSize: 'size.desktop',
      mobileSize: 'size.mobile',
      showDivider: 'showDivider',
    },
    prepare({type, desktopSize, mobileSize, showDivider}) {
      const typeDisplay = 
        type === 'vertical' ? 'Vertikal' :
        type === 'horizontal' ? 'Horisontal' :
        'Seksjon'
      
      const sizeDisplay = `${desktopSize || 'medium'} (${mobileSize || 'medium'} mobil)`
      const dividerDisplay = showDivider ? ' • med skillelinje' : ''
      
      return {
        title: 'Mellomrom',
        subtitle: `${typeDisplay} • ${sizeDisplay}${dividerDisplay}`,
        media: ExpandIcon,
      }
    },
  },
})

// Generate HTML for spacer
export function generateSpacerHtml(data: {
  type: string
  size?: {desktop: string, mobile: string}
  showDivider?: boolean
  dividerStyle?: string
}): string {
  const desktopSize = data.size?.desktop || 'medium'
  const mobileSize = data.size?.mobile || 'medium'
  
  const classes = [
    'spacer',
    `spacer-${data.type}`,
    `spacer-desktop-${desktopSize}`,
    `spacer-mobile-${mobileSize}`,
  ]

  if (data.showDivider && data.type === 'section') {
    classes.push('spacer-with-divider')
    classes.push(`spacer-divider-${data.dividerStyle || 'solid'}`)
  }

  return `<div class="${classes.join(' ')}" role="separator" aria-hidden="true"></div>`
}

// CSS for spacer component
export const spacerCSS = `
.spacer {
  width: 100%;
}

/* Vertical spacers */
.spacer-vertical {
  height: var(--spacer-size);
}

/* Horizontal spacers (for inline layouts) */
.spacer-horizontal {
  display: inline-block;
  width: var(--spacer-size);
  height: 1px;
}

/* Section spacers */
.spacer-section {
  height: var(--spacer-size);
  position: relative;
}

.spacer-with-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 1px;
  background-color: currentColor;
  opacity: 0.2;
}

.spacer-divider-dashed::after {
  border-top: 1px dashed currentColor;
  background: none;
}

.spacer-divider-dotted::after {
  border-top: 1px dotted currentColor;
  background: none;
}

/* Desktop sizes */
.spacer-desktop-xs { --spacer-size: 0.5rem; }
.spacer-desktop-small { --spacer-size: 1rem; }
.spacer-desktop-medium { --spacer-size: 2rem; }
.spacer-desktop-large { --spacer-size: 3rem; }
.spacer-desktop-xl { --spacer-size: 4rem; }
.spacer-desktop-xxl { --spacer-size: 6rem; }
.spacer-desktop-xxxl { --spacer-size: 8rem; }

/* Mobile sizes */
@media (max-width: 768px) {
  .spacer-mobile-xs { --spacer-size: 0.25rem !important; }
  .spacer-mobile-small { --spacer-size: 0.5rem !important; }
  .spacer-mobile-medium { --spacer-size: 1rem !important; }
  .spacer-mobile-large { --spacer-size: 1.5rem !important; }
  .spacer-mobile-xl { --spacer-size: 2rem !important; }
  .spacer-mobile-xxl { --spacer-size: 3rem !important; }
}
`