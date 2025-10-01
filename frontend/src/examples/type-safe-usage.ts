/**
 * COMPREHENSIVE EXAMPLES: Type-Safe Sanity + Astro Integration
 *
 * This file demonstrates how to use the new type-safe GROQ queries,
 * multilingual content handling, and component props in your Astro application.
 *
 * IMPORTANT: This is an example file - do not import this in production.
 * Instead, copy the patterns you need into your actual components.
 */

import type { APIRoute } from 'astro'
import {
  // Query functions
  loadHomepage,
  loadEvent,
  loadArtist,
  loadAllEvents,
  loadFeaturedEvents,
  loadSiteSettings,
  // Custom query execution
  executeCustomQuery
} from '../lib/sanityQueries'
import {
  // Helper functions
  getLocalizedTitle,
  getLocalizedSlug,
  getLocalizedContent,
  getLocalizedImage,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  formatEventDate,
  formatEventTime,
  isUpcomingEvent,
  getLocalizedUrl,
  createEventProps,
  createArtistProps,
  generateMetaTags,
  handleQueryError,
  isValidQueryResult
} from '../lib/sanity-helpers'
import type {
  EventQueryResult,
  ArtistQueryResult,
  PageQueryResult,
  HomepageQueryResult,
  SupportedLanguage,
  QueryResult
} from '../lib/sanity-queries'

// ============================================================================
// EXAMPLE 1: ASTRO PAGE COMPONENT (.astro file)
// ============================================================================

/*
---
// In an actual .astro file, this would be in the frontmatter

// Type-safe event detail page
import { loadEvent, loadSiteSettings } from '../lib/sanityQueries'
import {
  getLocalizedTitle,
  getLocalizedContent,
  getOptimizedImageUrl,
  formatEventDate,
  generateMetaTags,
  isValidQueryResult
} from '../lib/sanity-helpers'
import type { EventQueryResult, SupportedLanguage } from '../lib/sanity-queries'

// Get slug and language from URL
const { slug } = Astro.params
const language: SupportedLanguage = Astro.url.pathname.startsWith('/en') ? 'en' : 'no'

if (!slug) {
  return Astro.redirect('/404')
}

// Load event data with type safety
const eventResult = await loadEvent(slug, Astro.request)
const siteSettingsResult = await loadSiteSettings(Astro.request)

// Handle errors gracefully
if (!isValidQueryResult(eventResult)) {
  console.error('Failed to load event:', eventResult.error)
  return Astro.redirect('/404')
}

const event = eventResult.data
const siteSettings = siteSettingsResult.data

// Get localized content with type safety
const title = getLocalizedTitle(event, language)
const content = getLocalizedContent(event, 'content', language)
const image = getLocalizedImage(event, language)

// Generate SEO meta tags
const meta = generateMetaTags(event, language, Astro.site?.toString())

// Generate optimized image URLs
const heroImageUrl = image ? getOptimizedImageUrl(image, {
  width: 1200,
  height: 600,
  quality: 85,
  format: 'webp'
}) : null

const thumbnailUrl = image ? getOptimizedImageUrl(image, {
  width: 400,
  height: 300,
  quality: 80,
  format: 'webp'
}) : null
---

<!-- HTML template with full type safety -->
<html lang={language}>
<head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  {meta.image && <meta property="og:image" content={meta.image} />}
  <meta property="og:locale" content={meta.locale} />
</head>
<body>
  <main>
    <h1>{title}</h1>

    {heroImageUrl && (
      <img
        src={heroImageUrl}
        alt={image?.alt || title}
        width="1200"
        height="600"
      />
    )}

    {event.eventDate && (
      <time datetime={event.eventDate.date}>
        {formatEventDate(event.eventDate, language)}
      </time>
    )}

    {event.venue && (
      <p>Venue: {event.venue.title}</p>
    )}

    {event.artist && event.artist.length > 0 && (
      <div>
        <h2>Artists:</h2>
        {event.artist.map(artist => (
          <span key={artist._id}>{artist.name}</span>
        ))}
      </div>
    )}

    <!-- Render PageBuilder content -->
    {content && content.map(component => (
      <div key={component._key}>
        <!-- Component renderer would go here -->
        {component._type}: {JSON.stringify(component)}
      </div>
    ))}
  </main>
</body>
</html>
*/

// ============================================================================
// EXAMPLE 2: TYPE-SAFE API ROUTE
// ============================================================================

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Get query parameters with type safety
    const searchParams = new URLSearchParams(url.search)
    const language: SupportedLanguage = searchParams.get('lang') === 'en' ? 'en' : 'no'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Load featured events with type safety
    const eventsResult = await loadFeaturedEvents(limit, request)

    if (!isValidQueryResult(eventsResult)) {
      return new Response(JSON.stringify({
        error: 'Failed to load events',
        details: eventsResult.error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Transform data for API response
    const events = eventsResult.data.map(event => ({
      id: event._id,
      title: getLocalizedTitle(event, language),
      slug: getLocalizedSlug(event, language),
      date: event.eventDate?.date,
      venue: event.venue?.title,
      artists: event.artist?.map(artist => artist.name) || [],
      image: event.image ? getOptimizedImageUrl(
        getLocalizedImage(event, language) || event.image,
        { width: 400, height: 300, format: 'webp', quality: 80 }
      ) : null
    }))

    return new Response(JSON.stringify({
      events,
      language,
      total: events.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// ============================================================================
// EXAMPLE 3: REACT COMPONENT WITH TYPE SAFETY
// ============================================================================

import React from 'react'

interface EventCardProps {
  event: EventQueryResult
  language: SupportedLanguage
  showImage?: boolean
  showExcerpt?: boolean
  showDate?: boolean
  className?: string
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  language,
  showImage = true,
  showExcerpt = true,
  showDate = true,
  className = ''
}) => {
  // Get localized content with type safety
  const title = getLocalizedTitle(event, language)
  const excerpt = getLocalizedContent<string>(event, 'excerpt', language)
  const image = showImage ? getLocalizedImage(event, language) : null
  const url = getLocalizedUrl(event, language, '/events')

  // Generate optimized image URL
  const imageUrl = image ? getOptimizedImageUrl(image, {
    width: 400,
    height: 300,
    format: 'webp',
    quality: 80,
    fit: 'crop'
  }) : null

  // Format date
  const formattedDate = showDate && event.eventDate ?
    formatEventDate(event.eventDate, language, {
      month: 'short',
      day: 'numeric'
    }) : null

  return (
    <article className={`event-card ${className}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={image?.alt || title}
          loading="lazy"
          width="400"
          height="300"
        />
      )}

      <div className="event-card__content">
        <h3>
          <a href={url}>{title}</a>
        </h3>

        {formattedDate && (
          <time
            dateTime={event.eventDate?.date}
            className="event-card__date"
          >
            {formattedDate}
          </time>
        )}

        {showExcerpt && excerpt && (
          <p className="event-card__excerpt">{excerpt}</p>
        )}

        {event.venue && (
          <p className="event-card__venue">{event.venue.title}</p>
        )}

        {event.artist && event.artist.length > 0 && (
          <div className="event-card__artists">
            {event.artist.map((artist, index) => (
              <span key={artist._id}>
                {index > 0 && ', '}
                {artist.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

// ============================================================================
// EXAMPLE 4: CUSTOM QUERY WITH TYPE SAFETY
// ============================================================================

interface CustomEventListOptions {
  language: SupportedLanguage
  venue?: string
  limit?: number
  includeUpcoming?: boolean
}

async function loadCustomEventList(
  options: CustomEventListOptions,
  request?: Request
): Promise<QueryResult<EventQueryResult[]>> {
  const {
    language,
    venue,
    limit = 10,
    includeUpcoming = true
  } = options

  // Build custom GROQ query with type safety
  const customQuery = `
    *[_type == "event" &&
      (publishingStatus == "published" ||
       (publishingStatus == "scheduled" &&
        now() >= scheduledPeriod.startDate &&
        now() <= scheduledPeriod.endDate)) &&
      ${venue ? 'venue->title == $venue &&' : ''}
      ${includeUpcoming ? 'eventDate->date >= now() &&' : ''}
      defined(${language === 'en' ? 'title_en' : 'title_no'})
    ] | order(eventDate->date asc)[0...$limit] {
      _id,
      _type,
      title_no,
      title_en,
      slug_no,
      slug_en,
      excerpt_no,
      excerpt_en,
      image,
      image_no,
      image_en,
      artist[]->{
        _id,
        name,
        slug,
        instrument_no,
        instrument_en
      },
      venue->{
        _id,
        title,
        slug
      },
      eventDate->{
        _id,
        title_no,
        title_en,
        date
      },
      eventTime,
      ticketUrl
    }
  `

  // Execute custom query with error handling
  return executeCustomQuery<EventQueryResult[]>(
    customQuery,
    { venue, limit },
    request
  )
}

// ============================================================================
// EXAMPLE 5: MULTILINGUAL CONTENT PROCESSING
// ============================================================================

interface MultilingualContentProcessor {
  processEvent(event: EventQueryResult): {
    no: ProcessedEvent
    en: ProcessedEvent
  }
}

interface ProcessedEvent {
  title: string
  slug: string
  excerpt: string
  url: string
  hasContent: boolean
  image?: {
    url: string
    alt: string
    width: number
    height: number
  }
}

class ContentProcessor implements MultilingualContentProcessor {
  constructor(private baseUrl: string = '') {}

  processEvent(event: EventQueryResult) {
    return {
      no: this.processEventForLanguage(event, 'no'),
      en: this.processEventForLanguage(event, 'en')
    }
  }

  private processEventForLanguage(
    event: EventQueryResult,
    language: SupportedLanguage
  ): ProcessedEvent {
    const title = getLocalizedTitle(event, language)
    const slug = getLocalizedSlug(event, language)
    const excerpt = getLocalizedContent<string>(event, 'excerpt', language) || ''
    const url = `${this.baseUrl}${getLocalizedUrl(event, language, '/events')}`
    const hasContent = !!(title && slug)

    const image = getLocalizedImage(event, language)
    const processedImage = image ? {
      url: getOptimizedImageUrl(image, {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 85
      }) || '',
      alt: image.alt || title,
      width: 800,
      height: 600
    } : undefined

    return {
      title,
      slug,
      excerpt,
      url,
      hasContent,
      image: processedImage
    }
  }
}

// Usage example
async function exampleContentProcessing() {
  const eventResult = await loadEvent('example-slug')

  if (!isValidQueryResult(eventResult)) {
    console.error('Failed to load event')
    return
  }

  const processor = new ContentProcessor('https://example.com')
  const processedContent = processor.processEvent(eventResult.data)

  console.log('Norwegian content:', processedContent.no)
  console.log('English content:', processedContent.en)
}

// ============================================================================
// EXAMPLE 6: COMPONENT PROP FACTORIES
// ============================================================================

// Factory function for creating standardized component props
function createComponentProps<T>(
  data: T,
  language: SupportedLanguage,
  options: Record<string, any> = {}
) {
  return {
    data,
    language,
    ...options,
    className: options.className || '',
    'data-testid': options.testId || ''
  }
}

// Usage examples
async function exampleComponentProps() {
  const eventResult = await loadEvent('example-slug')

  if (!isValidQueryResult(eventResult)) return

  const event = eventResult.data

  // Create props for different component variations
  const cardProps = createEventProps(event, 'no', {
    showImage: true,
    showExcerpt: true,
    showArtists: true,
    linkToDetail: true
  })

  const listItemProps = createEventProps(event, 'no', {
    showImage: false,
    showExcerpt: false,
    showDate: true,
    showTime: true
  })

  const heroProps = createEventProps(event, 'no', {
    showImage: true,
    showExcerpt: true,
    showArtists: true,
    showVenue: true,
    showDate: true,
    showTime: true,
    linkToDetail: false
  })

  return { cardProps, listItemProps, heroProps }
}

// ============================================================================
// EXAMPLE 7: ERROR HANDLING PATTERNS
// ============================================================================

// Error boundary for query results
function withErrorHandling<T>(
  queryResult: QueryResult<T>,
  fallback: T,
  onError?: (error: string) => void
): T {
  if (isValidQueryResult(queryResult)) {
    return queryResult.data
  }

  if (queryResult.error && onError) {
    onError(queryResult.error)
  }

  return fallback
}

// Usage in component
async function exampleErrorHandling() {
  const eventResult = await loadEvent('nonexistent-slug')

  const event = withErrorHandling(
    eventResult,
    null, // fallback
    (error) => console.error('Event load failed:', error)
  )

  if (!event) {
    // Handle missing event
    return { notFound: true }
  }

  return { event }
}

// ============================================================================
// EXAMPLE 8: PERFORMANCE OPTIMIZATION
// ============================================================================

// Batch loading multiple content types
async function loadPageData(
  slug: string,
  language: SupportedLanguage,
  request?: Request
) {
  // Load multiple queries in parallel for better performance
  const [
    homepageResult,
    eventsResult,
    artistsResult,
    siteSettingsResult
  ] = await Promise.all([
    loadHomepage(request),
    loadFeaturedEvents(6, request),
    loadAllArtists(request),
    loadSiteSettings(request)
  ])

  // Process results with error handling
  const homepage = handleQueryError(homepageResult, null, 'Failed to load homepage')
  const events = handleQueryError(eventsResult, [], 'Failed to load events')
  const artists = handleQueryError(artistsResult, [], 'Failed to load artists')
  const siteSettings = handleQueryError(siteSettingsResult, null, 'Failed to load site settings')

  return {
    homepage,
    events,
    artists,
    siteSettings,
    language,
    hasErrors: !!(
      homepageResult.error ||
      eventsResult.error ||
      artistsResult.error ||
      siteSettingsResult.error
    )
  }
}

// ============================================================================
// EXPORT EXAMPLES FOR REFERENCE
// ============================================================================

export {
  // Components
  EventCard,

  // Functions
  loadCustomEventList,
  ContentProcessor,
  createComponentProps,
  withErrorHandling,
  loadPageData,

  // Example usage
  exampleContentProcessing,
  exampleComponentProps,
  exampleErrorHandling
}

/**
 * KEY TAKEAWAYS FROM THESE EXAMPLES:
 *
 * 1. FULL TYPE SAFETY: All queries return properly typed results
 * 2. MULTILINGUAL SUPPORT: Helper functions handle language switching seamlessly
 * 3. ERROR HANDLING: Graceful fallbacks and error reporting throughout
 * 4. IMAGE OPTIMIZATION: Automatic responsive image generation
 * 5. PERFORMANCE: Parallel loading and proper caching strategies
 * 6. COMPONENT PATTERNS: Standardized props and reusable patterns
 * 7. VISUAL EDITING: Full support for Sanity's Visual Editing mode
 * 8. SEO OPTIMIZATION: Automatic meta tag generation
 *
 * NEXT STEPS:
 * - Copy relevant patterns into your actual components
 * - Customize the helper functions for your specific needs
 * - Add additional query functions for your content types
 * - Implement proper error boundaries in your UI
 * - Set up monitoring for query performance
 */