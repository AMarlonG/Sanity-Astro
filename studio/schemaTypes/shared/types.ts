/**
 * TypeScript types for consistent schema development
 */

// Base component data interfaces
export interface BaseComponentData {
  _type: string
  _key?: string
}

export interface SpacingData {
  marginTop?: string
  marginBottom?: string
  paddingTop?: string
  paddingBottom?: string
}

export interface ThemeData {
  variant?: 'default' | 'dark' | 'light' | 'accent' | 'festival'
  backgroundType?: 'none' | 'solid' | 'gradient' | 'pattern'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface AnimationData {
  entrance?: 'none' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'zoomIn'
  delay?: string
  duration?: string
}

export interface GlobalComponentData extends BaseComponentData {
  spacing?: SpacingData
  theme?: ThemeData
  animation?: AnimationData
}

// Content component interfaces
export interface TitleData extends GlobalComponentData {
  mainTitle: string
  subtitle?: string
}

export interface HeadingData extends GlobalComponentData {
  level: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
  id?: { current: string }
}

export interface ImageData extends GlobalComponentData {
  image: any
  alt?: string
  caption?: string
  credit?: string
  aspectRatio?: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'small' | 'medium' | 'large' | 'full'
}

export interface VideoData extends GlobalComponentData {
  videoType: 'sanity' | 'youtube' | 'vimeo' | 'external'
  video?: any
  youtubeUrl?: string
  vimeoUrl?: string
  externalUrl?: string
  title?: string
  description?: string
  aspectRatio?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
}

export interface ButtonData extends GlobalComponentData {
  text: string
  url?: string
  style?: 'primary' | 'secondary' | 'outline' | 'link'
  size?: 'small' | 'medium' | 'large' | 'xl'
  action?: 'link' | 'form' | 'modal' | 'download'
  icon?: string
  iconPosition?: 'before' | 'after'
  disabled?: boolean
  fullWidth?: boolean
}

export interface QuoteData extends GlobalComponentData {
  quote: string
  author?: string
  source?: string
  cite?: string
}

// Layout component interfaces
export interface ResponsiveLayoutData extends GlobalComponentData {
  layoutType: 'columns' | 'flexbox' | 'stack'
  desktopColumns?: string
  tabletColumns?: string
  mobileColumns?: string
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexWrap?: boolean
  gap?: {
    desktop: string
    mobile: string
  }
  alignment?: {
    horizontal: string
    vertical: string
  }
  containerWidth?: 'full' | 'container' | 'narrow' | 'wide'
  items: GlobalComponentData[]
}

export interface GridLayoutData extends GlobalComponentData {
  gridTemplate: 'hero' | 'magazine' | 'masonry' | 'custom'
  gridAreas?: string
  gridItems: Array<{
    component: GlobalComponentData[]
    gridArea?: string
    span?: {
      columns: number
      rows: number
    }
  }>
  responsiveGrid?: {
    tabletBehavior: 'keep' | 'two-columns' | 'stack'
    mobileBehavior: 'stack' | 'two-columns'
  }
  gap?: {
    desktop: string
    mobile: string
  }
}

export interface SpacerData extends GlobalComponentData {
  type: 'vertical' | 'horizontal' | 'section'
  size: {
    desktop: string
    mobile: string
  }
  showDivider?: boolean
  dividerStyle?: 'solid' | 'dashed' | 'dotted'
}

// Section component interfaces
export interface ScrollContainerData extends GlobalComponentData {
  title?: string
  items: any[]
  showScrollbar?: boolean
  format?: string
}

export interface ArtistScrollContainerData extends ScrollContainerData {
  cardFormat?: string
}

export interface EventScrollContainerData extends ScrollContainerData {
  showDate?: boolean
  showTime?: boolean
  showVenue?: boolean
  showArtists?: boolean
  sortBy?: 'date-asc' | 'date-desc' | 'title-asc' | 'manual'
  cardFormat?: string
}

// Document interfaces
export interface EventData {
  _id?: string
  title: string
  slug: { current: string }
  content?: GlobalComponentData[]
  eventDate?: { date: string }
  eventTime?: string
  venue?: { title: string }
  artists?: Array<{ name: string }>
  image?: ImageData['image']
  buttonText?: string
  buttonUrl?: string
  buttonOpenInNewTab?: boolean
}

export interface ArtistData {
  _id?: string
  name: string
  slug: { current: string }
  content?: GlobalComponentData[]
  image?: ImageData['image']
  bio?: string
  genres?: Array<{ title: string }>
}

// Utility types
export type ComponentType = 
  | 'title'
  | 'headingComponent'
  | 'portableTextBlock'
  | 'quoteComponent'
  | 'imageComponent'
  | 'videoComponent'
  | 'buttonComponent'
  | 'enhancedButtonComponent'
  | 'linkComponent'
  | 'accordionComponent'
  | 'columnLayout'
  | 'gridLayout'
  | 'spacer'
  | 'contentScrollContainer'
  | 'artistScrollContainer'
  | 'eventScrollContainer'

export type PageBuilderComponent = GlobalComponentData & {
  _type: ComponentType
}

// HTML generation function type
export type ComponentHTMLGenerator<T = GlobalComponentData> = (data: T) => string

// Validation rule type
export type ValidationRule = (Rule: any) => any

// Schema field group type
export interface SchemaGroup {
  name: string
  title: string
  default?: boolean
  icon?: any
}

// Component preview data type
export interface ComponentPreview {
  title: string
  subtitle?: string
  media?: any
}