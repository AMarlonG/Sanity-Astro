/**
 * Type-safe GROQ queries for Sanity content
 * Maps Studio interfaces to frontend query results with full TypeScript support
 */

import { defineQuery } from 'groq'
import type {
  EventData,
  ArtistData,
  PageData,
  ArticleData,
  HomepageData,
  ProgramPageData,
  ArtistPageData,
  SeoFieldsData,
  PageBuilderComponent,
  SupportedLanguage
} from '../../../studio/schemaTypes/shared/types'

// ============================================================================
// CORE QUERY FRAGMENTS
// ============================================================================

/**
 * Image asset fragment with full metadata and URL generation
 */
const imageFragment = `{
  _type,
  asset->{
    _id,
    _type,
    url,
    altText,
    title,
    description,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      },
      lqip,
      palette {
        dominant {
          background,
          foreground
        }
      }
    }
  },
  hotspot,
  crop,
  alt,
  caption,
  credit
}`

/**
 * SEO fields fragment
 */
const seoFragment = `{
  title,
  description,
  keywords,
  image${imageFragment},
  noIndex
}`

/**
 * Reference expansion fragment for artists
 */
const artistReferenceFragment = `{
  _id,
  _type,
  name,
  slug,
  image_no${imageFragment},
  image_en${imageFragment},
  image${imageFragment},
  instrument_no,
  instrument_en,
  excerpt_no,
  excerpt_en
}`

/**
 * Reference expansion fragment for venues
 */
const venueReferenceFragment = `{
  _id,
  _type,
  title,
  slug,
  address,
  city,
  linkText,
  linkUrl,
  openInNewTab
}`

/**
 * Reference expansion fragment for event dates
 */
const eventDateReferenceFragment = `{
  _id,
  _type,
  title_no,
  title_en,
  date
}`

/**
 * Publishing status filter for multilingual content
 */
const publishingFilter = `(
  publishingStatus == "published" ||
  (publishingStatus == "scheduled" &&
   now() >= scheduledPeriod.startDate &&
   now() <= scheduledPeriod.endDate)
)`

/**
 * PageBuilder content fragment with all component types
 */
const pageBuilderFragment = `[]{
  _key,
  _type,
  // Global component properties
  spacing,
  theme,
  animation,
  // Title component
  mainTitle,
  subtitle,
  // Heading component
  level,
  text,
  id,
  // Image component
  image${imageFragment},
  alt,
  caption,
  credit,
  aspectRatio,
  alignment,
  size,
  // Video component
  videoType,
  video,
  youtubeUrl,
  vimeoUrl,
  externalUrl,
  title,
  description,
  aspectRatio,
  autoplay,
  muted,
  controls,
  loop,
  // Button component
  text,
  url,
  style,
  size,
  action,
  icon,
  iconPosition,
  disabled,
  fullWidth,
  // Link component
  text,
  linkType,
  internalLink->{
    slug
  },
  url,
  email,
  phone,
  openInNewTab,
  accessibility,
  // Quote component
  quote,
  author,
  source,
  cite,
  // Accordion component
  title,
  description,
  panels[]{
    title,
    content${pageBuilderFragment}
  },
  accessibility,
  // Portable Text component
  content,
  // Layout components
  layoutType,
  desktopColumns,
  tabletColumns,
  mobileColumns,
  flexDirection,
  flexWrap,
  gap,
  alignment,
  containerWidth,
  items${pageBuilderFragment},
  gridTemplate,
  gridAreas,
  gridItems[]{
    component${pageBuilderFragment},
    gridArea,
    span
  },
  responsiveGrid,
  // Spacer component
  type,
  size,
  showDivider,
  dividerStyle,
  // Scroll containers
  title,
  items[]->${artistReferenceFragment},
  showScrollbar,
  format,
  cardFormat,
  showDate,
  showTime,
  showVenue,
  showArtists,
  sortBy
}`

// ============================================================================
// QUERY RESULT TYPES
// ============================================================================

/**
 * Query result types that extend Studio interfaces with query-specific data
 */

export interface EventQueryResult extends Omit<EventData, 'artist' | 'composers' | 'venue' | 'eventDate'> {
  artist?: Array<ArtistData & { _id: string }>
  composers?: Array<ArtistData & { _id: string }>
  venue?: VenueQueryResult
  eventDate?: EventDateQueryResult
}

export interface ArtistQueryResult extends ArtistData {
  events?: Array<EventQueryResult>
}

export interface PageQueryResult extends PageData {
  content_no?: PageBuilderComponent[]
  content_en?: PageBuilderComponent[]
}

export interface ArticleQueryResult extends ArticleData {
  content_no?: PageBuilderComponent[]
  content_en?: PageBuilderComponent[]
}

export interface HomepageQueryResult extends HomepageData {
  content_no?: PageBuilderComponent[]
  content_en?: PageBuilderComponent[]
}

export interface ProgramPageQueryResult extends Omit<ProgramPageData, 'selectedEvents'> {
  selectedEvents?: Array<EventQueryResult>
}

export interface ArtistPageQueryResult extends Omit<ArtistPageData, 'selectedArtists'> {
  selectedArtists?: Array<ArtistQueryResult>
}

export interface VenueQueryResult {
  _id: string
  _type: 'venue'
  title: string
  slug: { current: string }
  address?: string
  city?: string
  linkText?: string
  linkUrl?: string
  openInNewTab?: boolean
}

export interface EventDateQueryResult {
  _id: string
  _type: 'eventDate'
  title_no?: string
  title_en?: string
  date: string
}

export interface SiteSettingsQueryResult {
  _id: string
  _type: 'siteSettings'
  title_no?: string
  title_en?: string
  description_no?: string
  description_en?: string
  keywords_no?: string[]
  keywords_en?: string[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  analytics?: {
    googleAnalyticsId?: string
    facebookPixelId?: string
  }
}

// ============================================================================
// MULTILINGUAL QUERY UTILITIES
// ============================================================================

/**
 * Get localized field name for GROQ queries
 */
export function getLocalizedFieldQuery(fieldName: string, language: SupportedLanguage): string {
  return `${fieldName}_${language}`
}

/**
 * Create multilingual content selection in GROQ
 */
export function createMultilingualSelection(fieldName: string): string {
  return `${fieldName}_no, ${fieldName}_en`
}

/**
 * Create language-specific query with fallback
 */
export function createLanguageQuery(language: SupportedLanguage, fallbackLanguage: SupportedLanguage = 'no'): string {
  return `coalesce(${getLocalizedFieldQuery('', language)}, ${getLocalizedFieldQuery('', fallbackLanguage)})`
}

// ============================================================================
// SINGLE DOCUMENT QUERIES
// ============================================================================

/**
 * Get single event by slug
 */
export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && (slug_no.current == $slug || slug_en.current == $slug) && ${publishingFilter}][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    // Multilingual content
    title_no,
    slug_no,
    excerpt_no,
    content_no${pageBuilderFragment},
    title_en,
    slug_en,
    excerpt_en,
    content_en${pageBuilderFragment},
    // Images
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    // References
    artist[]->${artistReferenceFragment},
    composers[]->${artistReferenceFragment},
    venue->${venueReferenceFragment},
    eventDate->${eventDateReferenceFragment},
    // Event details
    eventTime,
    ticketUrl,
    // Publishing
    publishingStatus,
    scheduledPeriod,
    // SEO
    seo${seoFragment}
  }
`)

/**
 * Get single artist by slug
 */
export const artistBySlugQuery = defineQuery(`
  *[_type == "artist" && slug.current == $slug && ${publishingFilter}][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    // Basic info
    name,
    slug,
    // Multilingual content
    excerpt_no,
    instrument_no,
    content_no${pageBuilderFragment},
    excerpt_en,
    instrument_en,
    content_en${pageBuilderFragment},
    // Images
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    // Publishing
    publishingStatus,
    scheduledPeriod,
    // SEO
    seo${seoFragment},
    // Related events
    "events": *[_type == "event" && references(^._id) && ${publishingFilter}] | order(eventDate->date asc) {
      _id,
      title_no,
      title_en,
      slug_no,
      slug_en,
      eventDate->${eventDateReferenceFragment},
      venue->${venueReferenceFragment}
    }
  }
`)

/**
 * Get single page by slug
 */
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && (slug_no.current == $slug || slug_en.current == $slug) && ${publishingFilter}][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    // Multilingual content
    title_no,
    slug_no,
    content_no${pageBuilderFragment},
    title_en,
    slug_en,
    content_en${pageBuilderFragment},
    // Images
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    // Publishing
    publishingStatus,
    scheduledPeriod,
    // SEO
    seo${seoFragment}
  }
`)

/**
 * Get single article by slug
 */
export const articleBySlugQuery = defineQuery(`
  *[_type == "article" && (slug_no.current == $slug || slug_en.current == $slug) && ${publishingFilter}][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    // Multilingual content
    title_no,
    slug_no,
    excerpt_no,
    content_no${pageBuilderFragment},
    title_en,
    slug_en,
    excerpt_en,
    content_en${pageBuilderFragment},
    // Images
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    // Publishing
    publishingStatus,
    scheduledPeriod,
    // SEO
    seo${seoFragment}
  }
`)

/**
 * Get program page by slug
 */
export const programPageBySlugQuery = defineQuery(`
  *[_type == "programPage" && (slug_no.current == $slug || slug_en.current == $slug)][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    // Multilingual content
    title_no,
    slug_no,
    excerpt_no,
    content_no${pageBuilderFragment},
    title_en,
    slug_en,
    excerpt_en,
    content_en${pageBuilderFragment},
    // Selected events with full details
    selectedEvents[]->{
      _id,
      _type,
      title_no,
      title_en,
      slug_no,
      slug_en,
      excerpt_no,
      excerpt_en,
      image${imageFragment},
      image_no${imageFragment},
      image_en${imageFragment},
      artist[]->${artistReferenceFragment},
      venue->${venueReferenceFragment},
      eventDate->${eventDateReferenceFragment},
      eventTime,
      ticketUrl
    },
    // SEO
    seo${seoFragment}
  }
`)

/**
 * Get artist page by slug
 */
export const artistPageBySlugQuery = defineQuery(`
  *[_type == "artistPage" && (slug_no.current == $slug || slug_en.current == $slug)][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    // Multilingual content
    title_no,
    slug_no,
    excerpt_no,
    content_no${pageBuilderFragment},
    title_en,
    slug_en,
    excerpt_en,
    content_en${pageBuilderFragment},
    // Selected artists with full details
    selectedArtists[]->{
      _id,
      _type,
      name,
      slug,
      excerpt_no,
      instrument_no,
      excerpt_en,
      instrument_en,
      image${imageFragment},
      image_no${imageFragment},
      image_en${imageFragment},
      "eventCount": count(*[_type == "event" && references(^._id) && ${publishingFilter}])
    },
    // SEO
    seo${seoFragment}
  }
`)

// ============================================================================
// HOMEPAGE QUERIES
// ============================================================================

/**
 * Get active homepage (scheduled or default)
 */
export const activeHomepageQuery = defineQuery(`
  // First try to get scheduled homepage
  *[_type == "homepage" &&
    homePageType == "scheduled" &&
    scheduledPeriod.startDate <= now() &&
    scheduledPeriod.endDate >= now()
  ] | order(scheduledPeriod.startDate desc)[0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    adminTitle,
    content_no${pageBuilderFragment},
    content_en${pageBuilderFragment},
    homePageType,
    scheduledPeriod,
    seo${seoFragment}
  }

  // If no scheduled homepage, get default
  ?? *[_type == "homepage" && homePageType == "default"][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    adminTitle,
    content_no${pageBuilderFragment},
    content_en${pageBuilderFragment},
    homePageType,
    scheduledPeriod,
    seo${seoFragment}
  }
`)

// ============================================================================
// LIST QUERIES
// ============================================================================

/**
 * Get all published events
 */
export const allEventsQuery = defineQuery(`
  *[_type == "event" && ${publishingFilter}] | order(eventDate->date asc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    artist[]->${artistReferenceFragment},
    venue->${venueReferenceFragment},
    eventDate->${eventDateReferenceFragment},
    eventTime,
    ticketUrl,
    _updatedAt
  }
`)

/**
 * Get featured events
 */
export const featuredEventsQuery = defineQuery(`
  *[_type == "event" && ${publishingFilter} && eventDate->date >= now()] | order(eventDate->date asc)[0...$limit] {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    artist[]->${artistReferenceFragment},
    venue->${venueReferenceFragment},
    eventDate->${eventDateReferenceFragment},
    eventTime,
    ticketUrl
  }
`)

/**
 * Get all published artists
 */
export const allArtistsQuery = defineQuery(`
  *[_type == "artist" && ${publishingFilter}] | order(name asc) {
    _id,
    _type,
    name,
    slug,
    excerpt_no,
    instrument_no,
    excerpt_en,
    instrument_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    "eventCount": count(*[_type == "event" && references(^._id) && ${publishingFilter}])
  }
`)

/**
 * Get all published pages
 */
export const allPagesQuery = defineQuery(`
  *[_type == "page" && ${publishingFilter}] | order(_createdAt desc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    _createdAt,
    _updatedAt
  }
`)

/**
 * Get all published articles
 */
export const allArticlesQuery = defineQuery(`
  *[_type == "article" && ${publishingFilter}] | order(_createdAt desc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    _createdAt,
    _updatedAt
  }
`)

// ============================================================================
// SITE SETTINGS AND GLOBALS
// ============================================================================

/**
 * Get site settings
 */
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    _id,
    _type,
    title_no,
    title_en,
    description_no,
    description_en,
    keywords_no,
    keywords_en,
    logo${imageFragment},
    favicon${imageFragment},
    socialMedia,
    contactInfo,
    analytics,
    navigation_no,
    navigation_en,
    footer_no,
    footer_en
  }
`)

// ============================================================================
// SEARCH AND FILTERING QUERIES
// ============================================================================

/**
 * Search content across all document types
 */
export const searchContentQuery = defineQuery(`
  *[
    _type in ["event", "artist", "page", "article"] &&
    ${publishingFilter} &&
    (
      title_no match $searchTerm ||
      title_en match $searchTerm ||
      excerpt_no match $searchTerm ||
      excerpt_en match $searchTerm ||
      name match $searchTerm
    )
  ] | order(_score desc, _createdAt desc)[0...$limit] {
    _id,
    _type,
    _score,
    title_no,
    title_en,
    slug_no,
    slug_en,
    name,
    excerpt_no,
    excerpt_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment}
  }
`)

/**
 * Get events by date range
 */
export const eventsByDateRangeQuery = defineQuery(`
  *[
    _type == "event" &&
    ${publishingFilter} &&
    eventDate->date >= $startDate &&
    eventDate->date <= $endDate
  ] | order(eventDate->date asc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    image${imageFragment},
    image_no${imageFragment},
    image_en${imageFragment},
    artist[]->${artistReferenceFragment},
    venue->${venueReferenceFragment},
    eventDate->${eventDateReferenceFragment},
    eventTime,
    ticketUrl
  }
`)

// ============================================================================
// SITEMAP AND SEO QUERIES
// ============================================================================

/**
 * Get all document slugs for sitemap generation
 */
export const sitemapQuery = defineQuery(`
  {
    "events": *[_type == "event" && ${publishingFilter}] {
      "slug_no": slug_no.current,
      "slug_en": slug_en.current,
      _updatedAt
    },
    "artists": *[_type == "artist" && ${publishingFilter}] {
      "slug": slug.current,
      _updatedAt
    },
    "pages": *[_type == "page" && ${publishingFilter}] {
      "slug_no": slug_no.current,
      "slug_en": slug_en.current,
      _updatedAt
    },
    "articles": *[_type == "article" && ${publishingFilter}] {
      "slug_no": slug_no.current,
      "slug_en": slug_en.current,
      _updatedAt
    }
  }
`)

// ============================================================================
// QUERY PARAMETER TYPES
// ============================================================================

export interface QueryParams {
  slug?: string
  searchTerm?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
  language?: SupportedLanguage
}

// ============================================================================
// QUERY EXECUTION HELPER TYPES
// ============================================================================

export interface QueryOptions {
  perspective?: 'published' | 'drafts'
  useCdn?: boolean
  stega?: boolean
  token?: string
  tag?: string
  cache?: number
}

export interface QueryResult<T> {
  data: T | null
  error?: string
  loading?: boolean
}

// ============================================================================
// QUERY VALIDATION HELPERS
// ============================================================================

/**
 * Validate query parameters
 */
export function validateQueryParams(params: QueryParams): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (params.limit && (params.limit < 1 || params.limit > 100)) {
    errors.push('Limit must be between 1 and 100')
  }

  if (params.offset && params.offset < 0) {
    errors.push('Offset must be non-negative')
  }

  if (params.startDate && isNaN(Date.parse(params.startDate))) {
    errors.push('Start date must be a valid ISO date string')
  }

  if (params.endDate && isNaN(Date.parse(params.endDate))) {
    errors.push('End date must be a valid ISO date string')
  }

  if (params.language && !['no', 'en'].includes(params.language)) {
    errors.push('Language must be "no" or "en"')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Type guard for checking if a query result has data
 */
export function hasQueryData<T>(result: QueryResult<T>): result is QueryResult<T> & { data: T } {
  return result.data !== null && result.data !== undefined
}

/**
 * Type guard for checking if a query result has an error
 */
export function hasQueryError<T>(result: QueryResult<T>): result is QueryResult<T> & { error: string } {
  return !!result.error
}