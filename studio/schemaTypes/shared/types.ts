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

export interface LinkComponentData extends GlobalComponentData {
  text: string
  linkType: 'internal' | 'anchor' | 'url' | 'email' | 'phone'
  internalLink?: {
    _type?: string
    slug?: {
      current: string
    } | string
  }
  anchorId?: string
  url?: string
  email?: string
  phone?: string
  linkTarget?: '_self' | '_blank'
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
  }
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

export interface AccordionData extends GlobalComponentData {
  title: string
  description?: string
  panels: Array<{
    title: string
    content: GlobalComponentData[]
  }>
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
  }
}

export interface PortableTextData extends GlobalComponentData {
  content: PortableTextBlock[]
}

export interface PortableTextBlock {
  _type: string
  _key: string
  style?: string
  listItem?: string
  level?: number
  children?: PortableTextSpan[]
  markDefs?: PortableTextMarkDefinition[]
  [key: string]: any
}

export interface PortableTextSpan {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

export interface PortableTextMarkDefinition {
  _type: string
  _key: string
  [key: string]: any
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
  _type: 'event'
  // Artists and composers
  artist?: Array<{
    _ref: string
    _type: 'reference'
  }>
  composers?: Array<{
    _ref: string
    _type: 'reference'
  }>
  // Basic event info
  ticketUrl?: string
  venue?: {
    _ref: string
    _type: 'reference'
  }
  eventDate?: {
    _ref: string
    _type: 'reference'
  }
  eventTime?: {
    startTime?: string
    endTime?: string
  }
  // Multilingual content
  title_no?: string
  slug_no?: { current: string }
  excerpt_no?: string
  content_no?: GlobalComponentData[]
  title_en?: string
  slug_en?: { current: string }
  excerpt_en?: string
  content_en?: GlobalComponentData[]
  // Image
  image?: ImageData['image']
  image_no?: ImageData['image']
  image_en?: ImageData['image']
  // Publishing
  publishingStatus: 'published' | 'draft' | 'scheduled'
  scheduledPeriod?: {
    startDate?: string
    endDate?: string
  }
  // SEO
  seo?: SeoFieldsData
}

export interface ArtistData {
  _id?: string
  _type: 'artist'
  // Basic info
  name: string
  slug: { current: string }
  // Multilingual content
  excerpt_no?: string
  instrument_no?: string
  content_no?: GlobalComponentData[]
  excerpt_en?: string
  instrument_en?: string
  content_en?: GlobalComponentData[]
  // Image
  image?: ImageData['image']
  image_no?: ImageData['image']
  image_en?: ImageData['image']
  // Publishing
  publishingStatus: 'published' | 'draft' | 'scheduled'
  scheduledPeriod?: {
    startDate?: string
    endDate?: string
  }
  // Related events
  events?: Array<{
    _ref: string
    _type: 'reference'
  }>
  // SEO
  seo?: SeoFieldsData
}

export interface PageData {
  _id?: string
  _type: 'page'
  // Multilingual content
  title_no?: string
  slug_no?: { current: string }
  content_no?: GlobalComponentData[]
  title_en?: string
  slug_en?: { current: string }
  content_en?: GlobalComponentData[]
  // Image
  image?: ImageData['image']
  image_no?: ImageData['image']
  image_en?: ImageData['image']
  // Publishing
  publishingStatus: 'published' | 'draft' | 'scheduled'
  scheduledPeriod?: {
    startDate?: string
    endDate?: string
  }
  // SEO
  seo?: SeoFieldsData
}

export interface ArticleData {
  _id?: string
  _type: 'article'
  // Multilingual content
  title_no?: string
  slug_no?: { current: string }
  excerpt_no?: string
  content_no?: GlobalComponentData[]
  title_en?: string
  slug_en?: { current: string }
  excerpt_en?: string
  content_en?: GlobalComponentData[]
  // Image
  image?: ImageData['image']
  image_no?: ImageData['image']
  image_en?: ImageData['image']
  // Publishing
  publishingStatus: 'published' | 'draft' | 'scheduled'
  scheduledPeriod?: {
    startDate?: string
    endDate?: string
  }
  // SEO
  seo?: SeoFieldsData
}

export interface ProgramPageData {
  _id?: string
  _type: 'programPage'
  // Multilingual content
  title_no?: string
  slug_no?: { current: string }
  excerpt_no?: string
  content_no?: GlobalComponentData[]
  title_en?: string
  slug_en?: { current: string }
  excerpt_en?: string
  content_en?: GlobalComponentData[]
  // Selected events
  selectedEvents?: Array<{
    _ref: string
    _type: 'reference'
  }>
  // SEO
  seo?: SeoFieldsData
}

export interface ArtistPageData {
  _id?: string
  _type: 'artistPage'
  // Multilingual content
  title_no?: string
  slug_no?: { current: string }
  excerpt_no?: string
  content_no?: GlobalComponentData[]
  title_en?: string
  slug_en?: { current: string }
  excerpt_en?: string
  content_en?: GlobalComponentData[]
  // Selected artists
  selectedArtists?: Array<{
    _ref: string
    _type: 'reference'
  }>
  // SEO
  seo?: SeoFieldsData
}

export interface HomepageData {
  _id?: string
  _type: 'homepage'
  // Administrative title for Studio overview
  adminTitle?: string
  // Multilingual content (no title/slug fields - content starts with H1)
  content_no?: GlobalComponentData[]
  content_en?: GlobalComponentData[]
  // Homepage type and scheduling
  homePageType: 'default' | 'scheduled'
  scheduledPeriod?: {
    startDate?: string
    endDate?: string
  }
  // SEO
  seo?: SeoFieldsData
}

// SEO fields interface
export interface SeoFieldsData {
  title?: string
  description?: string
  keywords?: string[]
  image?: ImageData['image']
  indexingStatus?: 'index' | 'noindex'
}

// Publishing status types
export type PublishingStatus = 'published' | 'draft' | 'scheduled'

export interface ScheduledPeriod {
  startDate?: string
  endDate?: string
}

// Multilingual document interface
export interface MultilingualDocument {
  title_no?: string
  slug_no?: { current: string }
  content_no?: GlobalComponentData[]
  title_en?: string
  slug_en?: { current: string }
  content_en?: GlobalComponentData[]
  publishingStatus: PublishingStatus
  scheduledPeriod?: ScheduledPeriod
  seo?: SeoFieldsData
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
  | 'spacer'
  | 'contentScrollContainer'
  | 'artistScrollContainer'
  | 'eventScrollContainer'

export type DocumentType = 'event' | 'artist' | 'page' | 'article' | 'homepage' | 'programPage' | 'artistPage'

// Comprehensive PageBuilder union type for all possible components
export type PageBuilderComponent =
  | (TitleData & { _type: 'title' })
  | (HeadingData & { _type: 'headingComponent' })
  | (PortableTextData & { _type: 'portableTextBlock' })
  | (QuoteData & { _type: 'quoteComponent' })
  | (ImageData & { _type: 'imageComponent' })
  | (VideoData & { _type: 'videoComponent' })
  | (ButtonData & { _type: 'buttonComponent' | 'enhancedButtonComponent' })
  | (LinkComponentData & { _type: 'linkComponent' })
  | (AccordionData & { _type: 'accordionComponent' })
  | (ResponsiveLayoutData & { _type: 'columnLayout' })
  | (SpacerData & { _type: 'spacer' })
  | (ScrollContainerData & { _type: 'contentScrollContainer' })
  | (ArtistScrollContainerData & { _type: 'artistScrollContainer' })
  | (EventScrollContainerData & { _type: 'eventScrollContainer' })

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

// Utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Language support types
export type SupportedLanguage = 'no' | 'en'
export type LocalizedContent<T> = {
  [K in SupportedLanguage as `${string}_${K}`]: T
}

// Document state types
export interface DocumentState {
  isPublished: boolean
  isDraft: boolean
  isScheduled: boolean
  isLive?: boolean
  isExpired?: boolean
}

// Utility functions for type checking
export const isValidComponentType = (type: string): type is ComponentType => {
  return [
    'title',
    'headingComponent',
    'portableTextBlock',
    'quoteComponent',
    'imageComponent',
    'videoComponent',
    'buttonComponent',
    'enhancedButtonComponent',
    'linkComponent',
    'accordionComponent',
    'columnLayout',
    'spacer',
    'contentScrollContainer',
    'artistScrollContainer',
    'eventScrollContainer',
  ].includes(type)
}

export const isValidDocumentType = (type: string): type is DocumentType => {
  return ['event', 'artist', 'page', 'article', 'homepage', 'programPage', 'artistPage'].includes(type)
}

export const isValidPublishingStatus = (status: string): status is PublishingStatus => {
  return ['published', 'draft', 'scheduled'].includes(status)
}

// Type guards for document interfaces
export const isEventData = (data: any): data is EventData => {
  return data && data._type === 'event'
}

export const isArtistData = (data: any): data is ArtistData => {
  return data && data._type === 'artist'
}

export const isPageData = (data: any): data is PageData => {
  return data && data._type === 'page'
}

export const isArticleData = (data: any): data is ArticleData => {
  return data && data._type === 'article'
}

export const isProgramPageData = (data: any): data is ProgramPageData => {
  return data && data._type === 'programPage'
}

export const isArtistPageData = (data: any): data is ArtistPageData => {
  return data && data._type === 'artistPage'
}

export const isHomepageData = (data: any): data is HomepageData => {
  return data && data._type === 'homepage'
}

// Utility function to get localized content
export function getLocalizedField<T>(
  data: any,
  fieldName: string,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): T | undefined {
  const localizedFieldName = `${fieldName}_${language}`
  const fallbackFieldName = `${fieldName}_${fallbackLanguage}`

  return data[localizedFieldName] || data[fallbackFieldName]
}

// Utility function to check if document has content in a specific language
export function hasContentInLanguage(
  data: MultilingualDocument,
  language: SupportedLanguage
): boolean {
  const titleField = `title_${language}`
  const contentField = `content_${language}`

  return !!(data[titleField as keyof MultilingualDocument] ||
           data[contentField as keyof MultilingualDocument])
}

// Utility function to determine document state
export function getDocumentState(document: any): DocumentState {
  const isPublished = document._id && !document._id.startsWith('drafts.')
  const isDraft = !isPublished
  const isScheduled = document.publishingStatus === 'scheduled'

  let isLive = false
  let isExpired = false

  if (isScheduled && document.scheduledPeriod?.startDate && document.scheduledPeriod?.endDate) {
    const now = new Date()
    const start = new Date(document.scheduledPeriod.startDate)
    const end = new Date(document.scheduledPeriod.endDate)

    isLive = now >= start && now <= end
    isExpired = now > end
  }

  return {
    isPublished,
    isDraft,
    isScheduled,
    isLive,
    isExpired,
  }
}

// ============================================================================
// PAGEBUILDER TYPE GUARDS
// ============================================================================

// Type guards for PageBuilder components
export const isTitleComponent = (component: PageBuilderComponent): component is TitleData & { _type: 'title' } => {
  return component._type === 'title'
}

export const isHeadingComponent = (component: PageBuilderComponent): component is HeadingData & { _type: 'headingComponent' } => {
  return component._type === 'headingComponent'
}

export const isPortableTextComponent = (component: PageBuilderComponent): component is PortableTextData & { _type: 'portableTextBlock' } => {
  return component._type === 'portableTextBlock'
}

export const isQuoteComponent = (component: PageBuilderComponent): component is QuoteData & { _type: 'quoteComponent' } => {
  return component._type === 'quoteComponent'
}

export const isImageComponent = (component: PageBuilderComponent): component is ImageData & { _type: 'imageComponent' } => {
  return component._type === 'imageComponent'
}

export const isVideoComponent = (component: PageBuilderComponent): component is VideoData & { _type: 'videoComponent' } => {
  return component._type === 'videoComponent'
}

export const isButtonComponent = (component: PageBuilderComponent): component is ButtonData & { _type: 'buttonComponent' | 'enhancedButtonComponent' } => {
  return component._type === 'buttonComponent' || component._type === 'enhancedButtonComponent'
}

export const isLinkComponent = (component: PageBuilderComponent): component is LinkComponentData & { _type: 'linkComponent' } => {
  return component._type === 'linkComponent'
}

export const isAccordionComponent = (component: PageBuilderComponent): component is AccordionData & { _type: 'accordionComponent' } => {
  return component._type === 'accordionComponent'
}

export const isResponsiveLayoutComponent = (component: PageBuilderComponent): component is ResponsiveLayoutData & { _type: 'columnLayout' } => {
  return component._type === 'columnLayout'
}

export const isSpacerComponent = (component: PageBuilderComponent): component is SpacerData & { _type: 'spacer' } => {
  return component._type === 'spacer'
}

export const isScrollContainerComponent = (component: PageBuilderComponent): component is ScrollContainerData & { _type: 'contentScrollContainer' } => {
  return component._type === 'contentScrollContainer'
}

export const isArtistScrollContainerComponent = (component: PageBuilderComponent): component is ArtistScrollContainerData & { _type: 'artistScrollContainer' } => {
  return component._type === 'artistScrollContainer'
}

export const isEventScrollContainerComponent = (component: PageBuilderComponent): component is EventScrollContainerData & { _type: 'eventScrollContainer' } => {
  return component._type === 'eventScrollContainer'
}

// ============================================================================
// PAGEBUILDER VALIDATION
// ============================================================================

// Validation interface for component requirements
export interface ComponentValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Validate individual PageBuilder component
export function validatePageBuilderComponent(component: any): ComponentValidationResult {
  const result: ComponentValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  // Check basic structure
  if (!component || typeof component !== 'object') {
    result.isValid = false
    result.errors.push('Component must be an object')
    return result
  }

  if (!component._type || typeof component._type !== 'string') {
    result.isValid = false
    result.errors.push('Component must have a valid _type field')
    return result
  }

  if (!isValidComponentType(component._type)) {
    result.isValid = false
    result.errors.push(`Invalid component type: ${component._type}`)
    return result
  }

  // Component-specific validation
  switch (component._type) {
    case 'title':
      if (!component.mainTitle || typeof component.mainTitle !== 'string') {
        result.isValid = false
        result.errors.push('Title component requires mainTitle field')
      }
      break

    case 'headingComponent':
      if (!component.text || typeof component.text !== 'string') {
        result.isValid = false
        result.errors.push('Heading component requires text field')
      }
      if (!component.level || !['h2', 'h3', 'h4', 'h5', 'h6'].includes(component.level)) {
        result.isValid = false
        result.errors.push('Heading component requires valid level (h2-h6)')
      }
      break

    case 'quoteComponent':
      if (!component.quote || typeof component.quote !== 'string') {
        result.isValid = false
        result.errors.push('Quote component requires quote field')
      }
      break

    case 'imageComponent':
      if (!component.image) {
        result.isValid = false
        result.errors.push('Image component requires image field')
      }
      break

    case 'videoComponent':
      if (!component.videoType) {
        result.isValid = false
        result.errors.push('Video component requires videoType field')
      }
      break

    case 'buttonComponent':
    case 'enhancedButtonComponent':
      if (!component.text || typeof component.text !== 'string') {
        result.isValid = false
        result.errors.push('Button component requires text field')
      }
      break

    case 'linkComponent':
      if (!component.text || typeof component.text !== 'string') {
        result.isValid = false
        result.errors.push('Link component requires text field')
      }
      if (!component.linkType || !['internal', 'anchor', 'url', 'email', 'phone'].includes(component.linkType)) {
        result.isValid = false
        result.errors.push('Link component requires valid linkType')
      }
      break

    case 'accordionComponent':
      if (!component.title || typeof component.title !== 'string') {
        result.isValid = false
        result.errors.push('Accordion component requires title field')
      }
      if (!Array.isArray(component.panels)) {
        result.isValid = false
        result.errors.push('Accordion component requires panels array')
      }
      break

    case 'columnLayout':
      if (!Array.isArray(component.items)) {
        result.isValid = false
        result.errors.push('Column layout requires items array')
      }
      break

    case 'spacer':
      if (!component.type || !['vertical', 'horizontal', 'section'].includes(component.type)) {
        result.isValid = false
        result.errors.push('Spacer requires valid type (vertical, horizontal, section)')
      }
      break

    case 'contentScrollContainer':
    case 'artistScrollContainer':
    case 'eventScrollContainer':
      if (!Array.isArray(component.items)) {
        result.isValid = false
        result.errors.push('Scroll container requires items array')
      }
      break
  }

  return result
}

// Validate array of PageBuilder components
export function validatePageBuilderContent(content: any[]): ComponentValidationResult {
  const result: ComponentValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (!Array.isArray(content)) {
    result.isValid = false
    result.errors.push('PageBuilder content must be an array')
    return result
  }

  // Track component keys for uniqueness
  const usedKeys = new Set<string>()
  const titleComponents = content.filter(c => c._type === 'title')

  // Validate each component
  content.forEach((component, index) => {
    const componentResult = validatePageBuilderComponent(component)

    if (!componentResult.isValid) {
      result.isValid = false
      componentResult.errors.forEach(error => {
        result.errors.push(`Component ${index}: ${error}`)
      })
    }

    componentResult.warnings.forEach(warning => {
      result.warnings.push(`Component ${index}: ${warning}`)
    })

    // Check key uniqueness
    if (component._key) {
      if (usedKeys.has(component._key)) {
        result.warnings.push(`Component ${index}: Duplicate _key found: ${component._key}`)
      } else {
        usedKeys.add(component._key)
      }
    }
  })

  // Content structure validation
  if (titleComponents.length > 1) {
    result.warnings.push('Multiple title components found - consider using heading components instead')
  }

  return result
}

// ============================================================================
// CONTENT PROCESSING UTILITIES
// ============================================================================

// Filter components by type
export function filterComponentsByType<T extends ComponentType>(
  content: PageBuilderComponent[],
  type: T
): PageBuilderComponent[] {
  return content.filter(component => component._type === type)
}

// Get all text content from PageBuilder components
export function extractTextContent(content: PageBuilderComponent[]): string {
  const textParts: string[] = []

  content.forEach(component => {
    switch (component._type) {
      case 'title':
        if (isTitleComponent(component)) {
          textParts.push(component.mainTitle)
          if (component.subtitle) textParts.push(component.subtitle)
        }
        break

      case 'headingComponent':
        if (isHeadingComponent(component)) {
          textParts.push(component.text)
        }
        break

      case 'quoteComponent':
        if (isQuoteComponent(component)) {
          textParts.push(component.quote)
          if (component.author) textParts.push(component.author)
        }
        break

      case 'buttonComponent':
      case 'enhancedButtonComponent':
        if (isButtonComponent(component)) {
          textParts.push(component.text)
        }
        break

      case 'linkComponent':
        if (isLinkComponent(component)) {
          textParts.push(component.text)
        }
        break

      case 'accordionComponent':
        if (isAccordionComponent(component)) {
          textParts.push(component.title)
          if (component.description) textParts.push(component.description)
          // Recursively extract text from panel content
          component.panels.forEach(panel => {
            textParts.push(panel.title)
            textParts.push(extractTextContent(panel.content))
          })
        }
        break

      case 'columnLayout':
        if (isResponsiveLayoutComponent(component)) {
          textParts.push(extractTextContent(component.items))
        }
        break

      case 'portableTextBlock':
        if (isPortableTextComponent(component)) {
          // Extract text from Portable Text blocks
          component.content.forEach(block => {
            if (block.children) {
              block.children.forEach(child => {
                if (child._type === 'span' && child.text) {
                  textParts.push(child.text)
                }
              })
            }
          })
        }
        break
    }
  })

  return textParts.join(' ')
}

// Calculate reading time based on content
export function calculateReadingTime(content: PageBuilderComponent[], wordsPerMinute: number = 200): number {
  const textContent = extractTextContent(content)
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Count words in content
export function countWords(content: PageBuilderComponent[]): number {
  const textContent = extractTextContent(content)
  return textContent.split(/\s+/).filter(word => word.length > 0).length
}

// Get content structure summary
export function getContentSummary(content: PageBuilderComponent[]) {
  const componentCounts: Record<string, number> = {}

  content.forEach(component => {
    componentCounts[component._type] = (componentCounts[component._type] || 0) + 1
  })

  return {
    totalComponents: content.length,
    componentTypes: componentCounts,
    wordCount: countWords(content),
    readingTime: calculateReadingTime(content),
    hasTitle: content.some(c => c._type === 'title'),
    hasImages: content.some(c => c._type === 'imageComponent'),
    hasVideos: content.some(c => c._type === 'videoComponent'),
    hasInteractiveElements: content.some(c =>
      c._type === 'buttonComponent' ||
      c._type === 'enhancedButtonComponent' ||
      c._type === 'linkComponent' ||
      c._type === 'accordionComponent'
    )
  }
}

// ============================================================================
// CONTENT RENDERING UTILITIES
// ============================================================================

// HTML escaping utility
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Basic HTML generation for components (for preview/debugging)
export function generateComponentPreviewHtml(component: PageBuilderComponent): string {
  try {
    switch (component._type) {
      case 'title':
        if (isTitleComponent(component)) {
          const subtitle = component.subtitle ? `<p class="subtitle">${escapeHtml(component.subtitle)}</p>` : ''
          return `<div class="title-component"><h1>${escapeHtml(component.mainTitle)}</h1>${subtitle}</div>`
        }
        break

      case 'headingComponent':
        if (isHeadingComponent(component)) {
          return `<${component.level}>${escapeHtml(component.text)}</${component.level}>`
        }
        break

      case 'quoteComponent':
        if (isQuoteComponent(component)) {
          const author = component.author ? `<cite>${escapeHtml(component.author)}</cite>` : ''
          return `<blockquote>${escapeHtml(component.quote)}${author}</blockquote>`
        }
        break

      case 'buttonComponent':
      case 'enhancedButtonComponent':
        if (isButtonComponent(component)) {
          const url = component.url || '#'
          return `<a href="${escapeHtml(url)}" class="button">${escapeHtml(component.text)}</a>`
        }
        break

      case 'linkComponent':
        if (isLinkComponent(component)) {
          return `<a href="#">${escapeHtml(component.text)}</a>`
        }
        break

      case 'spacer':
        if (isSpacerComponent(component)) {
          return `<div class="spacer spacer-${component.type}"></div>`
        }
        break

      default:
        return `<div class="component-placeholder">[${component._type}]</div>`
    }
  } catch (error) {
    return `<div class="component-error">[Error rendering ${component._type}]</div>`
  }

  return `<div class="component-unknown">[Unknown component: ${component._type}]</div>`
}

// Generate preview HTML for entire content array
export function generateContentPreviewHtml(content: PageBuilderComponent[]): string {
  if (!Array.isArray(content) || content.length === 0) {
    return '<div class="empty-content">No content</div>'
  }

  return content
    .map(component => generateComponentPreviewHtml(component))
    .join('\n')
}

// ============================================================================
// TYPE-SAFE CONTENT TRANSFORMATION
// ============================================================================

// Transform components for specific use cases
export function transformComponentsForExport(content: PageBuilderComponent[]) {
  return content.map(component => {
    const transformed = {
      ...component,
      _id: component._key || `component-${Math.random().toString(36).substr(2, 9)}`,
      _createdAt: new Date().toISOString(),
    }

    // Remove internal fields that shouldn't be exported
    delete transformed._key

    return transformed
  })
}

// Create component dependency map
export function createComponentDependencyMap(content: PageBuilderComponent[]): Map<string, string[]> {
  const dependencyMap = new Map<string, string[]>()

  content.forEach(component => {
    const dependencies: string[] = []

    // Check for references in different component types
    if (isLinkComponent(component) && component.internalLink) {
      dependencies.push('internalReference')
    }

    if (isImageComponent(component) && component.image) {
      dependencies.push('imageAsset')
    }

    if (isVideoComponent(component) && component.video) {
      dependencies.push('videoAsset')
    }

    if (isAccordionComponent(component)) {
      dependencies.push('nestedContent')
    }

    if (isResponsiveLayoutComponent(component)) {
      dependencies.push('layoutContent')
    }

    if (dependencies.length > 0) {
      dependencyMap.set(component._key || component._type, dependencies)
    }
  })

  return dependencyMap
}

// FORM DATA INTERFACES AND TYPES
// ===============================

// Base form validation result
export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
  data?: Record<string, any>
}

// Form validation rule function type
export type FormValidationRule<T = any> = (value: T, data?: Record<string, any>) => string | null

// Form field configuration
export interface FormFieldConfig {
  name: string
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'number'
  label: string
  placeholder?: string
  required?: boolean
  validation?: FormValidationRule[]
  options?: Array<{ value: string; label: string }> // For select/radio
  attributes?: Record<string, string | number | boolean>
}

// EVENT FILTER FORM INTERFACES
// =============================

export interface EventFilterFormData {
  eventDate?: string
  genre?: string
  venue?: string
}

export interface EventFilterOptions {
  eventDates: Array<{
    date: string
    title: string
    isActive: boolean
  }>
  genres: Array<{
    slug: { current: string }
    title: string
  }>
  venues: Array<{
    slug: { current: string }
    title: string
  }>
}

export interface EventFilterState {
  filters: EventFilterFormData
  loading: boolean
  error?: string
  resultCount?: number
}

// NEWSLETTER FORM INTERFACES
// ==========================

export interface NewsletterFormData {
  email: string
  name?: string
  language?: 'no' | 'en'
  consent: boolean
}

export interface NewsletterFormResponse {
  success: boolean
  message: string
  data?: {
    email: string
    subscribedAt: string
  }
}

// CONTACT FORM INTERFACES
// =======================

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
  phone?: string
  organization?: string
  eventInquiry?: boolean
  consent: boolean
}

export interface ContactFormResponse {
  success: boolean
  message: string
  data?: {
    submissionId: string
    submittedAt: string
  }
}

// SEARCH FORM INTERFACES
// ======================

export interface SearchFormData {
  query: string
  type?: 'all' | 'events' | 'artists' | 'articles' | 'pages'
  dateRange?: {
    start?: string
    end?: string
  }
}

export interface SearchResult {
  _id: string
  _type: string
  title: string
  slug?: { current: string }
  excerpt?: string
  image?: ImageData
  relevanceScore?: number
}

export interface SearchFormResponse {
  results: SearchResult[]
  totalCount: number
  query: string
  suggestions?: string[]
}

// GENERIC FORM UTILITIES
// ======================

export interface GenericFormData {
  [key: string]: string | number | boolean | string[] | File | null | undefined
}

export interface FormSubmissionContext {
  userAgent?: string
  ip?: string
  referrer?: string
  timestamp: string
  language?: string
}

export interface FormSubmissionResult<T = any> {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
  message?: string
  redirectUrl?: string
}

// FORM SECURITY INTERFACES
// =========================

export interface FormSecurityConfig {
  rateLimitMaxRequests: number
  rateLimitWindowMs: number
  maxBodySize: number
  allowedOrigins?: string[]
  csrfProtection: boolean
  sanitizeInput: boolean
}

export interface FormSecurityCheck {
  allowed: boolean
  reason?: string
  resetTime?: number
}

// FORM STATE MANAGEMENT
// =====================

export interface FormState<T = GenericFormData> {
  data: Partial<T>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  submitting: boolean
  submitted: boolean
  valid: boolean
}

export interface FormAction<T = GenericFormData> {
  type: 'SET_FIELD' | 'SET_ERRORS' | 'SET_SUBMITTING' | 'RESET_FORM' | 'TOUCH_FIELD'
  payload?: {
    field?: string
    value?: any
    errors?: Record<string, string[]>
    data?: Partial<T>
  }
}

// FORM VALIDATION UTILITIES
// ==========================

// Type guards for form data
export const isEventFilterFormData = (data: any): data is EventFilterFormData => {
  return data && typeof data === 'object'
}

export const isNewsletterFormData = (data: any): data is NewsletterFormData => {
  return data && typeof data.email === 'string' && typeof data.consent === 'boolean'
}

export const isContactFormData = (data: any): data is ContactFormData => {
  return data &&
         typeof data.name === 'string' &&
         typeof data.email === 'string' &&
         typeof data.message === 'string' &&
         typeof data.consent === 'boolean'
}

export const isSearchFormData = (data: any): data is SearchFormData => {
  return data && typeof data.query === 'string'
}

// Common validation rules
export const commonValidationRules = {
  required: <T>(value: T): string | null => {
    if (value === null || value === undefined || value === '') {
      return 'Dette feltet er påkrevd'
    }
    return null
  },

  email: (value: string): string | null => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : 'Ugyldig e-postadresse'
  },

  minLength: (min: number) => (value: string): string | null => {
    if (!value) return null
    return value.length >= min ? null : `Må være minst ${min} tegn`
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (!value) return null
    return value.length <= max ? null : `Kan ikke være mer enn ${max} tegn`
  },

  phone: (value: string): string | null => {
    if (!value) return null
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/
    return phoneRegex.test(value) ? null : 'Ugyldig telefonnummer'
  },

  url: (value: string): string | null => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch {
      return 'Ugyldig URL'
    }
  },

  consent: (value: boolean): string | null => {
    return value ? null : 'Du må godta vilkårene for å fortsette'
  }
} as const

// Form data processors
export const formDataProcessors = {
  sanitizeString: (value: string): string => {
    return value?.trim().replace(/[<>]/g, '') || ''
  },

  normalizeEmail: (email: string): string => {
    return email?.toLowerCase().trim() || ''
  },

  normalizePhone: (phone: string): string => {
    return phone?.replace(/\s|-/g, '') || ''
  },

  parseFormData: (formData: FormData): Record<string, any> => {
    const data: Record<string, any> = {}

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        data[key] = formDataProcessors.sanitizeString(value)
      } else {
        data[key] = value
      }
    }

    return data
  }
} as const

// Form validation function
export function validateFormData<T>(
  data: any,
  fields: FormFieldConfig[]
): FormValidationResult {
  const errors: Record<string, string[]> = {}
  let isValid = true

  fields.forEach(field => {
    const value = data[field.name]
    const fieldErrors: string[] = []

    // Check required fields
    if (field.required) {
      const requiredError = commonValidationRules.required(value)
      if (requiredError) {
        fieldErrors.push(requiredError)
        isValid = false
      }
    }

    // Run custom validation rules
    if (field.validation && value !== null && value !== undefined && value !== '') {
      field.validation.forEach(rule => {
        const error = rule(value, data)
        if (error) {
          fieldErrors.push(error)
          isValid = false
        }
      })
    }

    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors
    }
  })

  return {
    isValid,
    errors,
    data: isValid ? data : undefined
  }
}

// Create form field configurations for common forms
export const eventFilterFormFields: FormFieldConfig[] = [
  {
    name: 'eventDate',
    type: 'select',
    label: 'Dato',
    required: false
  },
  {
    name: 'genre',
    type: 'select',
    label: 'Sjanger',
    required: false
  },
  {
    name: 'venue',
    type: 'select',
    label: 'Spillested',
    required: false
  }
]

export const newsletterFormFields: FormFieldConfig[] = [
  {
    name: 'email',
    type: 'email',
    label: 'E-postadresse',
    placeholder: 'din@epost.no',
    required: true,
    validation: [commonValidationRules.email]
  },
  {
    name: 'name',
    type: 'text',
    label: 'Navn (valgfritt)',
    placeholder: 'Ditt navn',
    required: false,
    validation: [commonValidationRules.maxLength(100)]
  },
  {
    name: 'consent',
    type: 'checkbox',
    label: 'Jeg godtar å motta nyhetsbrev',
    required: true,
    validation: [commonValidationRules.consent]
  }
]

export const contactFormFields: FormFieldConfig[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Navn',
    placeholder: 'Ditt navn',
    required: true,
    validation: [commonValidationRules.minLength(2), commonValidationRules.maxLength(100)]
  },
  {
    name: 'email',
    type: 'email',
    label: 'E-postadresse',
    placeholder: 'din@epost.no',
    required: true,
    validation: [commonValidationRules.email]
  },
  {
    name: 'phone',
    type: 'tel',
    label: 'Telefon (valgfritt)',
    placeholder: '+47 12 34 56 78',
    required: false,
    validation: [commonValidationRules.phone]
  },
  {
    name: 'subject',
    type: 'text',
    label: 'Emne',
    placeholder: 'Kort beskrivelse av henvendelsen',
    required: false,
    validation: [commonValidationRules.maxLength(200)]
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Melding',
    placeholder: 'Skriv din melding her...',
    required: true,
    validation: [commonValidationRules.minLength(10), commonValidationRules.maxLength(2000)]
  },
  {
    name: 'organization',
    type: 'text',
    label: 'Organisasjon (valgfritt)',
    placeholder: 'Bedrift eller organisasjon',
    required: false,
    validation: [commonValidationRules.maxLength(100)]
  },
  {
    name: 'eventInquiry',
    type: 'checkbox',
    label: 'Dette gjelder en arrangementshevndelse',
    required: false
  },
  {
    name: 'consent',
    type: 'checkbox',
    label: 'Jeg godtar at mine opplysninger lagres og behandles i henhold til personvernpolitikken',
    required: true,
    validation: [commonValidationRules.consent]
  }
]

export const searchFormFields: FormFieldConfig[] = [
  {
    name: 'query',
    type: 'text',
    label: 'Søk',
    placeholder: 'Søk etter arrangementer, artister, artikler...',
    required: true,
    validation: [commonValidationRules.minLength(2), commonValidationRules.maxLength(100)]
  },
  {
    name: 'type',
    type: 'select',
    label: 'Type innhold',
    required: false,
    options: [
      { value: 'all', label: 'Alt innhold' },
      { value: 'events', label: 'Arrangementer' },
      { value: 'artists', label: 'Artister' },
      { value: 'articles', label: 'Artikler' },
      { value: 'pages', label: 'Sider' }
    ]
  }
]
