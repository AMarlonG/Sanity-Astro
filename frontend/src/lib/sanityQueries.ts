import { sanityClient } from 'sanity:client'
import {
  // Query definitions
  eventBySlugQuery,
  artistBySlugQuery,
  pageBySlugQuery,
  articleBySlugQuery,
  activeHomepageQuery,
  allEventsQuery,
  featuredEventsQuery,
  allArtistsQuery,
  siteSettingsQuery,
  // Result types
  type EventQueryResult,
  type ArtistQueryResult,
  type PageQueryResult,
  type ArticleQueryResult,
  type HomepageQueryResult,
  type SiteSettingsQueryResult,
  type QueryParams,
  type QueryOptions as BaseQueryOptions,
  type QueryResult
} from './sanity-queries'

/**
 * Modern query utility that supports Visual Editing and draft mode with full type safety
 */

export interface QueryOptions extends BaseQueryOptions {
  perspective?: 'published' | 'drafts'
  useCdn?: boolean
}

/**
 * Get the perspective based on preview mode
 */
export function getQueryPerspective(request?: Request): 'published' | 'drafts' {
  if (!request) return 'published';
  
  // Check for preview mode cookie
  const cookieHeader = request.headers.get('cookie');
  const hasPreviewMode = cookieHeader?.includes('sanity-preview-mode=true');
  
  return hasPreviewMode ? 'drafts' : 'published';
}

/**
 * Execute a Sanity query with Visual Editing support and full type safety
 */
function executeQuery<T>(
  query: string,
  params: QueryParams = {},
  options: QueryOptions = {}
): Promise<T> {
  const {
    perspective = 'published',
    useCdn,
    stega,
    token: optionsToken,
    cache = 60
  } = options

  const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'
  const token = optionsToken || import.meta.env.SANITY_API_READ_TOKEN

  // Require read token for visual editing
  if (visualEditingEnabled && !token) {
    throw new Error('SANITY_API_READ_TOKEN is required for Visual Editing')
  }

  return sanityClient.fetch(
    query,
    params,
    {
      perspective,
      useCdn: useCdn ?? (perspective === 'published' && !visualEditingEnabled),
      token: visualEditingEnabled ? token : undefined,
      stega: stega ?? visualEditingEnabled,
      next: { revalidate: perspective === 'published' ? cache : 0 }
    }
  )
}

/**
 * Safe query execution with error handling
 */
async function safeExecuteQuery<T>(
  query: string,
  params: QueryParams = {},
  options: QueryOptions = {}
): Promise<QueryResult<T>> {
  try {
    const data = await executeQuery<T>(query, params, options)
    return { data, loading: false }
  } catch (error) {
    console.error('Query execution failed:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      loading: false
    }
  }
}

/**
 * Load homepage with Visual Editing support and full type safety
 */
export async function loadHomepage(request?: Request): Promise<QueryResult<HomepageQueryResult>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<HomepageQueryResult>(activeHomepageQuery, {}, options)
}

/**
 * Load artist by slug with Visual Editing support and full type safety
 */
export async function loadArtist(slug: string, request?: Request): Promise<QueryResult<ArtistQueryResult>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<ArtistQueryResult>(artistBySlugQuery, { slug }, options)
}

/**
 * Load event by slug with Visual Editing support and full type safety
 */
export async function loadEvent(slug: string, request?: Request): Promise<QueryResult<EventQueryResult>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<EventQueryResult>(eventBySlugQuery, { slug }, options)
}

/**
 * Load article by slug with Visual Editing support and full type safety
 */
export async function loadArticle(slug: string, request?: Request): Promise<QueryResult<ArticleQueryResult>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<ArticleQueryResult>(articleBySlugQuery, { slug }, options)
}

/**
 * Load page by slug with Visual Editing support and full type safety
 */
export async function loadPage(slug: string, request?: Request): Promise<QueryResult<PageQueryResult>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<PageQueryResult>(pageBySlugQuery, { slug }, options)
}

// ============================================================================
// ADDITIONAL TYPE-SAFE QUERY FUNCTIONS
// ============================================================================

/**
 * Load all events with type safety
 */
export async function loadAllEvents(request?: Request): Promise<QueryResult<EventQueryResult[]>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<EventQueryResult[]>(allEventsQuery, {}, options)
}

/**
 * Load featured events with type safety
 */
export async function loadFeaturedEvents(limit: number = 6, request?: Request): Promise<QueryResult<EventQueryResult[]>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<EventQueryResult[]>(featuredEventsQuery, { limit }, options)
}

/**
 * Load all artists with type safety
 */
export async function loadAllArtists(request?: Request): Promise<QueryResult<ArtistQueryResult[]>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<ArtistQueryResult[]>(allArtistsQuery, {}, options)
}

/**
 * Load site settings with type safety
 */
export async function loadSiteSettings(request?: Request): Promise<QueryResult<SiteSettingsQueryResult>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective, cache: 3600 } // Cache for 1 hour

  return safeExecuteQuery<SiteSettingsQueryResult>(siteSettingsQuery, {}, options)
}

/**
 * Generic query executor for custom queries
 */
export async function executeCustomQuery<T>(
  query: string,
  params: QueryParams = {},
  request?: Request
): Promise<QueryResult<T>> {
  const perspective = getQueryPerspective(request)
  const options: QueryOptions = { perspective }

  return safeExecuteQuery<T>(query, params, options)
}