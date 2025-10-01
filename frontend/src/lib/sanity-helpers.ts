/**
 * Type-safe helper functions for Sanity data fetching and processing
 * Provides utilities for multilingual content, image optimization, and component props
 */

import { getImage } from '@sanity/image-url'
import { sanityClient } from 'sanity:client'
import type {
  EventQueryResult,
  ArtistQueryResult,
  PageQueryResult,
  ArticleQueryResult,
  HomepageQueryResult,
  SiteSettingsQueryResult,
  QueryResult
} from './sanity-queries'
import type {
  SupportedLanguage,
  PageBuilderComponent,
  ImageData,
  getLocalizedField
} from '../../../studio/schemaTypes/shared/types'

// ============================================================================
// MULTILINGUAL CONTENT HELPERS
// ============================================================================

/**
 * Get localized content from a multilingual document
 */
export function getLocalizedContent<T>(
  document: any,
  fieldName: string,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): T | undefined {
  const localizedField = `${fieldName}_${language}`
  const fallbackField = `${fieldName}_${fallbackLanguage}`

  return document?.[localizedField] || document?.[fallbackField]
}

/**
 * Get localized title with fallback
 */
export function getLocalizedTitle(
  document: EventQueryResult | PageQueryResult | ArticleQueryResult,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): string {
  return getLocalizedContent<string>(document, 'title', language, fallbackLanguage) || 'Untitled'
}

/**
 * Get localized slug with fallback
 */
export function getLocalizedSlug(
  document: EventQueryResult | PageQueryResult | ArticleQueryResult,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): string {
  const slug = getLocalizedContent<{ current: string }>(document, 'slug', language, fallbackLanguage)
  return slug?.current || ''
}

/**
 * Get localized excerpt with fallback
 */
export function getLocalizedExcerpt(
  document: EventQueryResult | ArticleQueryResult,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): string {
  return getLocalizedContent<string>(document, 'excerpt', language, fallbackLanguage) || ''
}

/**
 * Get localized content (PageBuilder components) with fallback
 */
export function getLocalizedPageContent(
  document: PageQueryResult | ArticleQueryResult | HomepageQueryResult,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): PageBuilderComponent[] {
  return getLocalizedContent<PageBuilderComponent[]>(document, 'content', language, fallbackLanguage) || []
}

/**
 * Get localized image with fallback
 */
export function getLocalizedImage(
  document: any,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'no'
): ImageData['image'] | undefined {
  const localizedImage = getLocalizedContent<ImageData['image']>(document, 'image', language, fallbackLanguage)
  return localizedImage || document?.image
}

/**
 * Check if document has content in specific language
 */
export function hasContentInLanguage(
  document: any,
  language: SupportedLanguage
): boolean {
  const titleField = `title_${language}`
  const contentField = `content_${language}`
  const nameField = 'name' // For artists

  return !!(
    document?.[titleField] ||
    document?.[contentField] ||
    (language === 'no' && document?.[nameField]) // Artists use 'name' field
  )
}

/**
 * Get available languages for a document
 */
export function getAvailableLanguages(document: any): SupportedLanguage[] {
  const languages: SupportedLanguage[] = []

  if (hasContentInLanguage(document, 'no')) {
    languages.push('no')
  }

  if (hasContentInLanguage(document, 'en')) {
    languages.push('en')
  }

  return languages
}

// ============================================================================
// IMAGE OPTIMIZATION HELPERS
// ============================================================================

/**
 * Configuration for image optimization
 */
export interface ImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  crop?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint'
  auto?: 'format' | 'compress'
}

/**
 * Generate optimized image URL from Sanity image asset
 */
export function getOptimizedImageUrl(
  image: ImageData['image'],
  options: ImageOptions = {}
): string | null {
  if (!image?.asset) {
    return null
  }

  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    fit = 'crop',
    crop = 'center',
    auto = 'format'
  } = options

  try {
    let imageBuilder = getImage(sanityClient).image(image.asset)

    if (width) imageBuilder = imageBuilder.width(width)
    if (height) imageBuilder = imageBuilder.height(height)
    if (format !== 'auto') imageBuilder = imageBuilder.format(format)
    if (auto) imageBuilder = imageBuilder.auto(auto)

    imageBuilder = imageBuilder
      .quality(quality)
      .fit(fit)

    // Apply hotspot and crop if available
    if (image.hotspot || image.crop) {
      imageBuilder = imageBuilder.crop('focalpoint')
    } else if (crop !== 'center') {
      imageBuilder = imageBuilder.crop(crop)
    }

    return imageBuilder.url()
  } catch (error) {
    console.error('Error generating optimized image URL:', error)
    return image.asset.url || null
  }
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function getResponsiveImageUrls(
  image: ImageData['image'],
  baseOptions: ImageOptions = {}
): {
  mobile: string | null
  tablet: string | null
  desktop: string | null
  large: string | null
} {
  return {
    mobile: getOptimizedImageUrl(image, { ...baseOptions, width: 480 }),
    tablet: getOptimizedImageUrl(image, { ...baseOptions, width: 768 }),
    desktop: getOptimizedImageUrl(image, { ...baseOptions, width: 1200 }),
    large: getOptimizedImageUrl(image, { ...baseOptions, width: 1920 })
  }
}

/**
 * Get image metadata for SEO and accessibility
 */
export function getImageMetadata(image: ImageData['image']) {
  if (!image?.asset) {
    return null
  }

  return {
    alt: image.alt || image.asset.altText || '',
    title: image.asset.title || '',
    caption: image.caption || '',
    credit: image.credit || '',
    width: image.asset.metadata?.dimensions?.width,
    height: image.asset.metadata?.dimensions?.height,
    aspectRatio: image.asset.metadata?.dimensions?.aspectRatio,
    lqip: image.asset.metadata?.lqip,
    dominantColor: image.asset.metadata?.palette?.dominant?.background
  }
}

// ============================================================================
// COMPONENT PROPS HELPERS
// ============================================================================

/**
 * Props for Event components
 */
export interface EventProps {
  event: EventQueryResult
  language: SupportedLanguage
  showImage?: boolean
  showExcerpt?: boolean
  showArtists?: boolean
  showVenue?: boolean
  showDate?: boolean
  showTime?: boolean
  linkToDetail?: boolean
}

/**
 * Props for Artist components
 */
export interface ArtistProps {
  artist: ArtistQueryResult
  language: SupportedLanguage
  showImage?: boolean
  showInstrument?: boolean
  showExcerpt?: boolean
  showEventCount?: boolean
  linkToDetail?: boolean
}

/**
 * Props for Page components
 */
export interface PageProps {
  page: PageQueryResult
  language: SupportedLanguage
  renderContent?: boolean
}

/**
 * Props for Article components
 */
export interface ArticleProps {
  article: ArticleQueryResult
  language: SupportedLanguage
  showImage?: boolean
  showExcerpt?: boolean
  showDate?: boolean
  linkToDetail?: boolean
}

/**
 * Create standardized props for Event components
 */
export function createEventProps(
  event: EventQueryResult,
  language: SupportedLanguage,
  options: Partial<EventProps> = {}
): EventProps {
  return {
    event,
    language,
    showImage: true,
    showExcerpt: true,
    showArtists: true,
    showVenue: true,
    showDate: true,
    showTime: false,
    linkToDetail: true,
    ...options
  }
}

/**
 * Create standardized props for Artist components
 */
export function createArtistProps(
  artist: ArtistQueryResult,
  language: SupportedLanguage,
  options: Partial<ArtistProps> = {}
): ArtistProps {
  return {
    artist,
    language,
    showImage: true,
    showInstrument: true,
    showExcerpt: true,
    showEventCount: false,
    linkToDetail: true,
    ...options
  }
}

// ============================================================================
// URL AND ROUTING HELPERS
// ============================================================================

/**
 * Generate localized URL for a document
 */
export function getLocalizedUrl(
  document: EventQueryResult | PageQueryResult | ArticleQueryResult,
  language: SupportedLanguage,
  basePath: string = ''
): string {
  const slug = getLocalizedSlug(document, language)

  if (!slug) {
    return basePath || '/'
  }

  // Handle language prefix for URLs
  const languagePrefix = language === 'en' ? '/en' : ''

  return `${languagePrefix}${basePath}/${slug}`
}

/**
 * Generate localized URLs for both languages
 */
export function getLocalizedUrls(
  document: EventQueryResult | PageQueryResult | ArticleQueryResult,
  basePath: string = ''
): { no: string; en: string } {
  return {
    no: getLocalizedUrl(document, 'no', basePath),
    en: getLocalizedUrl(document, 'en', basePath)
  }
}

/**
 * Get artist detail URL (artists only have one slug)
 */
export function getArtistUrl(artist: ArtistQueryResult, language: SupportedLanguage = 'no'): string {
  const slug = artist.slug?.current
  if (!slug) return '/artists'

  const languagePrefix = language === 'en' ? '/en' : ''
  return `${languagePrefix}/artists/${slug}`
}

// ============================================================================
// DATA VALIDATION HELPERS
// ============================================================================

/**
 * Validate query result and provide type-safe access
 */
export function isValidQueryResult<T>(result: QueryResult<T>): result is QueryResult<T> & { data: T } {
  return result && result.data !== null && result.data !== undefined && !result.error
}

/**
 * Handle query errors gracefully
 */
export function handleQueryError<T>(
  result: QueryResult<T>,
  fallback: T,
  errorMessage: string = 'Failed to load content'
): T {
  if (isValidQueryResult(result)) {
    return result.data
  }

  if (result.error) {
    console.error(`${errorMessage}:`, result.error)
  }

  return fallback
}

/**
 * Get safe content with fallback
 */
export function getSafeContent<T>(
  result: QueryResult<T> | undefined,
  fallback: T
): T {
  if (!result || !isValidQueryResult(result)) {
    return fallback
  }

  return result.data
}

// ============================================================================
// DATE AND TIME HELPERS
// ============================================================================

/**
 * Format event date for display
 */
export function formatEventDate(
  eventDate: EventQueryResult['eventDate'],
  language: SupportedLanguage = 'no',
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!eventDate?.date) {
    return ''
  }

  const date = new Date(eventDate.date)
  const locale = language === 'no' ? 'nb-NO' : 'en-US'

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return date.toLocaleDateString(locale, { ...defaultOptions, ...options })
}

/**
 * Format event time for display
 */
export function formatEventTime(
  eventTime: EventQueryResult['eventTime'],
  language: SupportedLanguage = 'no'
): string {
  if (!eventTime?.startTime) {
    return ''
  }

  const locale = language === 'no' ? 'nb-NO' : 'en-US'

  let timeString = eventTime.startTime

  if (eventTime.endTime) {
    timeString += ` - ${eventTime.endTime}`
  }

  return timeString
}

/**
 * Check if event is upcoming
 */
export function isUpcomingEvent(eventDate: EventQueryResult['eventDate']): boolean {
  if (!eventDate?.date) {
    return false
  }

  const now = new Date()
  const eventDateTime = new Date(eventDate.date)

  return eventDateTime > now
}

/**
 * Check if event is today
 */
export function isEventToday(eventDate: EventQueryResult['eventDate']): boolean {
  if (!eventDate?.date) {
    return false
  }

  const today = new Date()
  const eventDateTime = new Date(eventDate.date)

  return today.toDateString() === eventDateTime.toDateString()
}

// ============================================================================
// SEO HELPERS
// ============================================================================

/**
 * Generate meta tags for a document
 */
export function generateMetaTags(
  document: any,
  language: SupportedLanguage,
  baseUrl: string = ''
): {
  title: string
  description: string
  image?: string
  url: string
  locale: string
  type: 'website' | 'article'
} {
  const title = getLocalizedTitle(document, language)
  const description = getLocalizedExcerpt(document, language) ||
                    getLocalizedContent<string>(document, 'description', language) || ''
  const image = getLocalizedImage(document, language)
  const slug = getLocalizedSlug(document, language)

  const url = `${baseUrl}${getLocalizedUrl(document, language)}`
  const locale = language === 'no' ? 'nb_NO' : 'en_US'
  const type = document._type === 'article' ? 'article' : 'website'

  return {
    title,
    description,
    image: image ? getOptimizedImageUrl(image, { width: 1200, height: 630, fit: 'crop' }) || undefined : undefined,
    url,
    locale,
    type
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export {
  type SupportedLanguage,
  type PageBuilderComponent,
  type ImageData
} from '../../../studio/schemaTypes/shared/types'

export {
  type EventQueryResult,
  type ArtistQueryResult,
  type PageQueryResult,
  type ArticleQueryResult,
  type HomepageQueryResult,
  type SiteSettingsQueryResult,
  type QueryResult,
  type QueryParams
} from './sanity-queries'