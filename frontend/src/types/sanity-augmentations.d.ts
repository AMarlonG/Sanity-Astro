/**
 * Type augmentations for Sanity Astro integration
 * Extends existing types with our custom Studio interfaces
 */

import type {
  EventData,
  ArtistData,
  PageData,
  ArticleData,
  HomepageData,
  ProgramPageData,
  ArtistPageData,
  SiteSettingsData,
  PageBuilderComponent,
  SupportedLanguage
} from '../../studio/schemaTypes/shared/types'

import type {
  EventQueryResult,
  ArtistQueryResult,
  PageQueryResult,
  ArticleQueryResult,
  HomepageQueryResult,
  ProgramPageQueryResult,
  ArtistPageQueryResult,
  SiteSettingsQueryResult,
  QueryResult,
  QueryParams,
  QueryOptions
} from '../lib/sanity-queries'

import type {
  EventProps,
  ArtistProps,
  PageProps,
  ArticleProps,
  ImageOptions
} from '../lib/sanity-helpers'

// ============================================================================
// ASTRO COMPONENT PROPS DECLARATIONS
// ============================================================================

declare global {
  namespace Astro {
    interface Props {
      // Page-level props
      event?: EventQueryResult
      artist?: ArtistQueryResult
      page?: PageQueryResult
      article?: ArticleQueryResult
      homepage?: HomepageQueryResult
      siteSettings?: SiteSettingsQueryResult

      // Component-level props
      events?: EventQueryResult[]
      artists?: ArtistQueryResult[]
      pages?: PageQueryResult[]
      articles?: ArticleQueryResult[]

      // Language and localization
      language?: SupportedLanguage
      availableLanguages?: SupportedLanguage[]
      alternateUrls?: Record<SupportedLanguage, string>

      // Content structure
      content?: PageBuilderComponent[]
      components?: PageBuilderComponent[]

      // Query metadata
      queryResult?: QueryResult<any>
      queryError?: string
      isLoading?: boolean

      // SEO and meta
      meta?: {
        title: string
        description: string
        image?: string
        url: string
        locale: string
        type: 'website' | 'article'
      }

      // Component configuration
      showImage?: boolean
      showExcerpt?: boolean
      showDate?: boolean
      showTime?: boolean
      showArtists?: boolean
      showVenue?: boolean
      linkToDetail?: boolean
      cardFormat?: string
      imageOptions?: ImageOptions
    }
  }
}

// ============================================================================
// SANITY CLIENT AUGMENTATIONS
// ============================================================================

declare module 'sanity:client' {
  import type { SanityClient } from '@sanity/client'

  interface SanityClientConfig {
    projectId: string
    dataset: string
    apiVersion: string
    useCdn?: boolean
    token?: string
    perspective?: 'published' | 'drafts'
    stega?: boolean
  }

  const sanityClient: SanityClient
  export { sanityClient }
}

// ============================================================================
// ASTRO CONTENT LAYER AUGMENTATIONS
// ============================================================================

declare module 'astro:content' {
  interface ContentEntryMap {
    events: EventQueryResult
    artists: ArtistQueryResult
    pages: PageQueryResult
    articles: ArticleQueryResult
  }

  interface DataEntryMap {
    homepage: HomepageQueryResult
    siteSettings: SiteSettingsQueryResult
  }
}

// ============================================================================
// IMAGE URL BUILDER AUGMENTATIONS
// ============================================================================

declare module '@sanity/image-url' {
  import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'
  import type { SanityClient } from '@sanity/client'

  export function getImage(client: SanityClient): ImageUrlBuilder
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string
  id?: string
  'data-testid'?: string
}

export interface EventCardProps extends BaseComponentProps, EventProps {}
export interface ArtistCardProps extends BaseComponentProps, ArtistProps {}
export interface PageHeaderProps extends BaseComponentProps, PageProps {}
export interface ArticleCardProps extends BaseComponentProps, ArticleProps {}

export interface EventListProps extends BaseComponentProps {
  events: EventQueryResult[]
  language: SupportedLanguage
  title?: string
  showPagination?: boolean
  itemsPerPage?: number
  cardFormat?: 'card' | 'list' | 'minimal'
}

export interface ArtistGridProps extends BaseComponentProps {
  artists: ArtistQueryResult[]
  language: SupportedLanguage
  title?: string
  columns?: number
  showInstrument?: boolean
  showEventCount?: boolean
}

export interface PageBuilderProps extends BaseComponentProps {
  content: PageBuilderComponent[]
  language: SupportedLanguage
  context?: {
    events?: EventQueryResult[]
    artists?: ArtistQueryResult[]
  }
}

export interface NavigationProps extends BaseComponentProps {
  language: SupportedLanguage
  currentPath?: string
  siteSettings?: SiteSettingsQueryResult
}

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  locale?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  additionalMeta?: Record<string, string>
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DocumentType = 'event' | 'artist' | 'page' | 'article' | 'homepage'

export type DocumentWithLanguage<T> = T & {
  _language?: SupportedLanguage
  _availableLanguages?: SupportedLanguage[]
}

export type LocalizedDocument<T> = {
  [K in SupportedLanguage]?: T
}

export type QueryFunction<T> = (
  params?: QueryParams,
  options?: QueryOptions
) => Promise<QueryResult<T>>

export type ComponentRenderer<T = PageBuilderComponent> = (
  component: T,
  context: {
    language: SupportedLanguage
    index: number
    isFirst: boolean
    isLast: boolean
  }
) => string | Promise<string>

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface SanityError extends Error {
  statusCode?: number
  details?: any
  query?: string
  params?: QueryParams
}

export interface QueryError extends Error {
  type: 'QUERY_ERROR' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR'
  originalError?: Error
  query?: string
  params?: QueryParams
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheOptions {
  ttl?: number
  tags?: string[]
  revalidate?: boolean
  staleWhileRevalidate?: boolean
}

export interface CachedQueryResult<T> extends QueryResult<T> {
  cached: boolean
  cacheKey: string
  expiresAt?: number
}

// ============================================================================
// VISUAL EDITING TYPES
// ============================================================================

export interface VisualEditingConfig {
  enabled: boolean
  studioUrl: string
  token?: string
  perspective: 'published' | 'drafts'
  stega: boolean
}

export interface PreviewData<T = any> {
  data: T
  perspective: 'published' | 'drafts'
  token?: string
  draftMode: boolean
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Studio types
  EventData,
  ArtistData,
  PageData,
  ArticleData,
  HomepageData,
  ProgramPageData,
  ArtistPageData,
  PageBuilderComponent,
  SupportedLanguage,

  // Query result types
  EventQueryResult,
  ArtistQueryResult,
  PageQueryResult,
  ArticleQueryResult,
  HomepageQueryResult,
  ProgramPageQueryResult,
  ArtistPageQueryResult,
  SiteSettingsQueryResult,
  QueryResult,
  QueryParams,
  QueryOptions,

  // Helper types
  EventProps,
  ArtistProps,
  PageProps,
  ArticleProps,
  ImageOptions
}