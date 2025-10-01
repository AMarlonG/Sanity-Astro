/**
 * Language utilities for multilingual Sanity content
 */

export type Language = 'no' | 'en'

/**
 * Get the current language from URL or default to Norwegian
 */
export function getCurrentLanguage(url?: URL | string): Language {
  if (!url) return 'no'

  const urlPath = typeof url === 'string' ? url : url.pathname

  // Check if URL starts with /en/
  if (urlPath.startsWith('/en/')) {
    return 'en'
  }

  return 'no' // Default to Norwegian
}

/**
 * Get content field for current language with fallback
 */
export function getLocalizedField<T>(
  content: any,
  fieldName: string,
  language: Language = 'no'
): T | undefined {
  if (!content) return undefined

  const primaryField = `${fieldName}_${language}`
  const fallbackField = language === 'no' ? `${fieldName}_en` : `${fieldName}_no`

  return content[primaryField] || content[fallbackField] || content[fieldName]
}

/**
 * Get localized slug for current language with fallback
 */
export function getLocalizedSlug(
  content: any,
  language: Language = 'no'
): string {
  if (!content) return ''

  const slug = getLocalizedField(content, 'slug', language)

  if (typeof slug === 'object' && slug?.current) {
    return slug.current
  }

  return slug || ''
}

/**
 * Get localized title for current language with fallback
 */
export function getLocalizedTitle(
  content: any,
  language: Language = 'no'
): string {
  // For artists, use 'name' field which is shared
  if (content._type === 'artist' && content.name) {
    return content.name
  }

  // For venues, use 'title' field which is shared
  if (content._type === 'venue' && content.title) {
    return content.title
  }

  // For genres, use 'title' field which is shared
  if (content._type === 'genre' && content.title) {
    return content.title
  }

  // For other content types, use localized title
  return getLocalizedField(content, 'title', language) || 'Untitled'
}

/**
 * Get content for display based on language
 */
export function getLocalizedContent(
  entry: any,
  language: Language = 'no'
) {
  if (!entry) return null

  return {
    _id: entry._id,
    _type: entry._type,
    title: getLocalizedTitle(entry, language),
    slug: getLocalizedSlug(entry, language),
    excerpt: getLocalizedField(entry, 'excerpt', language),
    content: getLocalizedField(entry, 'content', language),
    // Preserve shared fields
    name: entry.name, // for artists
    venue: entry.venue,
    genre: entry.genre,
    artists: entry.artists,
    eventDate: entry.eventDate,
    eventTime: entry.eventTime,
    image: entry.image,
    publishedAt: entry.publishedAt,
    lastUpdated: entry.lastUpdated,
    // Preserve URLs and other shared data
    websiteUrl: entry.websiteUrl,
    spotifyUrl: entry.spotifyUrl,
    instagramUrl: entry.instagramUrl,
    linkText: entry.linkText,
    linkUrl: entry.linkUrl,
    openInNewTab: entry.openInNewTab,
    author: entry.author,
    instrument: getLocalizedField(entry, 'instrument', language),
  }
}