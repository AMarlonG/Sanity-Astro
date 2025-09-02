import {defineField} from 'sanity'

/**
 * Global spacing fields for consistent component spacing
 */
export const spacingFields = [
  defineField({
    name: 'spacing',
    title: 'Avstand',
    type: 'object',
    group: 'design',
    description: 'Kontroller avstand rundt komponenten',
    options: {
      collapsible: true,
      collapsed: true,
    },
    fields: [
      defineField({
        name: 'marginTop',
        title: 'Margin topp',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Ekstra liten', value: 'xs'},
            {title: 'Liten', value: 'sm'},
            {title: 'Medium', value: 'md'},
            {title: 'Stor', value: 'lg'},
            {title: 'Ekstra stor', value: 'xl'},
            {title: 'Dobbelt stor', value: '2xl'},
          ],
        },
        initialValue: 'md',
      }),
      defineField({
        name: 'marginBottom',
        title: 'Margin bunn',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Ekstra liten', value: 'xs'},
            {title: 'Liten', value: 'sm'},
            {title: 'Medium', value: 'md'},
            {title: 'Stor', value: 'lg'},
            {title: 'Ekstra stor', value: 'xl'},
            {title: 'Dobbelt stor', value: '2xl'},
          ],
        },
        initialValue: 'md',
      }),
      defineField({
        name: 'paddingTop',
        title: 'Padding topp',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Liten', value: 'sm'},
            {title: 'Medium', value: 'md'},
            {title: 'Stor', value: 'lg'},
            {title: 'Ekstra stor', value: 'xl'},
          ],
        },
        initialValue: 'none',
      }),
      defineField({
        name: 'paddingBottom',
        title: 'Padding bunn',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Liten', value: 'sm'},
            {title: 'Medium', value: 'md'},
            {title: 'Stor', value: 'lg'},
            {title: 'Ekstra stor', value: 'xl'},
          ],
        },
        initialValue: 'none',
      }),
    ],
  }),
]

/**
 * Global theme fields for consistent styling
 */
export const themeFields = [
  defineField({
    name: 'theme',
    title: 'Tema',
    type: 'object',
    group: 'design',
    description: 'Kontroller utseende og stil på komponenten',
    options: {
      collapsible: true,
      collapsed: true,
    },
    fields: [
      defineField({
        name: 'variant',
        title: 'Variant',
        type: 'string',
        description: 'Velg tema-variant for komponenten',
        options: {
          list: [
            {title: 'Standard', value: 'default'},
            {title: 'Mørk', value: 'dark'},
            {title: 'Lys', value: 'light'},
            {title: 'Aksentfarge', value: 'accent'},
            {title: 'Festival (fargerik)', value: 'festival'},
          ],
        },
        initialValue: 'default',
      }),
      defineField({
        name: 'backgroundType',
        title: 'Bakgrunn',
        type: 'string',
        description: 'Bakgrunnstype for komponenten',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Solid farge', value: 'solid'},
            {title: 'Gradient', value: 'gradient'},
            {title: 'Mønster', value: 'pattern'},
          ],
        },
        initialValue: 'none',
      }),
      defineField({
        name: 'borderRadius',
        title: 'Avrundede hjørner',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Liten', value: 'sm'},
            {title: 'Medium', value: 'md'},
            {title: 'Stor', value: 'lg'},
            {title: 'Full', value: 'full'},
          ],
        },
        initialValue: 'none',
      }),
      defineField({
        name: 'shadow',
        title: 'Skygge',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Liten', value: 'sm'},
            {title: 'Medium', value: 'md'},
            {title: 'Stor', value: 'lg'},
            {title: 'Kraftig', value: 'xl'},
          ],
        },
        initialValue: 'none',
      }),
    ],
  }),
]

/**
 * Animation fields for components that support animations
 */
export const animationFields = [
  defineField({
    name: 'animation',
    title: 'Animasjon',
    type: 'object',
    group: 'design',
    description: 'Kontroller animasjoner og effekter',
    options: {
      collapsible: true,
      collapsed: true,
    },
    fields: [
      defineField({
        name: 'entrance',
        title: 'Inngangsanimasjon',
        type: 'string',
        options: {
          list: [
            {title: 'Ingen', value: 'none'},
            {title: 'Fade inn', value: 'fadeIn'},
            {title: 'Glid inn fra venstre', value: 'slideInLeft'},
            {title: 'Glid inn fra høyre', value: 'slideInRight'},
            {title: 'Glid inn fra bunn', value: 'slideInUp'},
            {title: 'Zoom inn', value: 'zoomIn'},
          ],
        },
        initialValue: 'none',
      }),
      defineField({
        name: 'delay',
        title: 'Forsinkelse',
        type: 'string',
        description: 'Forsinkelse før animasjonen starter',
        options: {
          list: [
            {title: 'Ingen', value: '0'},
            {title: '100ms', value: '100'},
            {title: '200ms', value: '200'},
            {title: '300ms', value: '300'},
            {title: '500ms', value: '500'},
          ],
        },
        initialValue: '0',
      }),
      defineField({
        name: 'duration',
        title: 'Varighet',
        type: 'string',
        description: 'Hvor lenge animasjonen skal vare',
        options: {
          list: [
            {title: 'Rask (200ms)', value: '200'},
            {title: 'Normal (300ms)', value: '300'},
            {title: 'Sakte (500ms)', value: '500'},
            {title: 'Ekstra sakte (700ms)', value: '700'},
          ],
        },
        initialValue: '300',
      }),
    ],
  }),
]

/**
 * Design group definition for consistent grouping
 */
export const designGroup = {
  name: 'design',
  title: 'Design & Stil',
}

/**
 * Helper function to add all global fields to a component
 */
export function addGlobalFields(fields: any[], options: {
  includeSpacing?: boolean
  includeTheme?: boolean
  includeAnimation?: boolean
} = {}) {
  const {
    includeSpacing = true,
    includeTheme = true,
    includeAnimation = false
  } = options
  
  const globalFields = []
  
  if (includeSpacing) globalFields.push(...spacingFields)
  if (includeTheme) globalFields.push(...themeFields)
  if (includeAnimation) globalFields.push(...animationFields)
  
  return [...fields, ...globalFields]
}

/**
 * CSS classes generator for global theme system
 */
export function generateThemeClasses(data: {
  spacing?: {
    marginTop?: string
    marginBottom?: string
    paddingTop?: string
    paddingBottom?: string
  }
  theme?: {
    variant?: string
    backgroundType?: string
    borderRadius?: string
    shadow?: string
  }
  animation?: {
    entrance?: string
    delay?: string
    duration?: string
  }
}): string[] {
  const classes: string[] = []
  
  // Spacing classes
  if (data.spacing) {
    const { marginTop, marginBottom, paddingTop, paddingBottom } = data.spacing
    
    if (marginTop && marginTop !== 'md') classes.push(`mt-${marginTop}`)
    if (marginBottom && marginBottom !== 'md') classes.push(`mb-${marginBottom}`)
    if (paddingTop && paddingTop !== 'none') classes.push(`pt-${paddingTop}`)
    if (paddingBottom && paddingBottom !== 'none') classes.push(`pb-${paddingBottom}`)
  }
  
  // Theme classes
  if (data.theme) {
    const { variant, backgroundType, borderRadius, shadow } = data.theme
    
    if (variant && variant !== 'default') classes.push(`theme-${variant}`)
    if (backgroundType && backgroundType !== 'none') classes.push(`bg-${backgroundType}`)
    if (borderRadius && borderRadius !== 'none') classes.push(`rounded-${borderRadius}`)
    if (shadow && shadow !== 'none') classes.push(`shadow-${shadow}`)
  }
  
  // Animation classes
  if (data.animation) {
    const { entrance, delay, duration } = data.animation
    
    if (entrance && entrance !== 'none') {
      classes.push(`animate-${entrance}`)
      if (delay && delay !== '0') classes.push(`animate-delay-${delay}`)
      if (duration && duration !== '300') classes.push(`animate-duration-${duration}`)
    }
  }
  
  return classes
}

/**
 * Global CSS for the theme system (to be included in your frontend)
 */
export const globalThemeCSS = `
/* === SPACING SYSTEM === */
.mt-none { margin-top: 0; }
.mt-xs { margin-top: 0.5rem; }
.mt-sm { margin-top: 1rem; }
.mt-md { margin-top: 2rem; }
.mt-lg { margin-top: 3rem; }
.mt-xl { margin-top: 4rem; }
.mt-2xl { margin-top: 6rem; }

.mb-none { margin-bottom: 0; }
.mb-xs { margin-bottom: 0.5rem; }
.mb-sm { margin-bottom: 1rem; }
.mb-md { margin-bottom: 2rem; }
.mb-lg { margin-bottom: 3rem; }
.mb-xl { margin-bottom: 4rem; }
.mb-2xl { margin-bottom: 6rem; }

.pt-none { padding-top: 0; }
.pt-sm { padding-top: 1rem; }
.pt-md { padding-top: 2rem; }
.pt-lg { padding-top: 3rem; }
.pt-xl { padding-top: 4rem; }

.pb-none { padding-bottom: 0; }
.pb-sm { padding-bottom: 1rem; }
.pb-md { padding-bottom: 2rem; }
.pb-lg { padding-bottom: 3rem; }
.pb-xl { padding-bottom: 4rem; }

/* === THEME VARIANTS === */
.theme-default { 
  color: var(--text-primary);
  background: var(--bg-primary);
}

.theme-dark { 
  color: var(--text-light);
  background: var(--bg-dark);
}

.theme-light { 
  color: var(--text-dark);
  background: var(--bg-light);
}

.theme-accent { 
  color: var(--text-accent);
  background: var(--bg-accent);
}

.theme-festival { 
  color: var(--text-festival);
  background: linear-gradient(135deg, var(--festival-primary), var(--festival-secondary));
}

/* === BACKGROUND TYPES === */
.bg-solid { background: var(--bg-solid); }
.bg-gradient { background: var(--bg-gradient); }
.bg-pattern { background: var(--bg-pattern); }

/* === BORDER RADIUS === */
.rounded-none { border-radius: 0; }
.rounded-sm { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.5rem; }
.rounded-lg { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }

/* === SHADOWS === */
.shadow-none { box-shadow: none; }
.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15); }

/* === ANIMATIONS === */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fadeIn { animation-name: fadeIn; }
.animate-slideInLeft { animation-name: slideInLeft; }
.animate-slideInRight { animation-name: slideInRight; }
.animate-slideInUp { animation-name: slideInUp; }
.animate-zoomIn { animation-name: zoomIn; }

.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-500 { animation-delay: 500ms; }

.animate-duration-200 { animation-duration: 200ms; }
.animate-duration-300 { animation-duration: 300ms; }
.animate-duration-500 { animation-duration: 500ms; }
.animate-duration-700 { animation-duration: 700ms; }

/* Default animation properties */
[class*="animate-"] {
  animation-fill-mode: both;
  animation-timing-function: ease-out;
}
`