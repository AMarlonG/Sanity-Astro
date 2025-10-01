/**
 * Custom Sanity Content Loader for Astro 5 Content Layer API
 * Provides cached, performant access to Sanity content
 */

import type { Loader } from 'astro/content'
import { sanityClient } from 'sanity:client'
import { createHash } from 'crypto'

export interface SanityLoaderConfig {
  query: string
  type: string
  params?: Record<string, any>
  parseContent?: (entry: any) => any
}

/**
 * Create a custom Sanity loader for Astro Content Layer
 */
export function createSanityLoader(config: SanityLoaderConfig): Loader {
  return {
    name: `sanity-loader-${config.type}`,
    
    async load({ store, parseData, logger, meta }) {
      logger.info(`Loading Sanity content for type: ${config.type}`)
      
      try {
        // Check for cached data and last sync time
        const lastSync = await meta.get('lastSync')
        const currentTime = new Date().toISOString()
        
        // Fetch content from Sanity
        const entries = await sanityClient.fetch(config.query, config.params || {})
        
        if (!Array.isArray(entries)) {
          logger.warn(`Expected array from Sanity query, got ${typeof entries}`)
          return
        }
        
        logger.info(`Fetched ${entries.length} entries from Sanity`)
        
        // Clear existing entries for this collection
        store.clear()
        
        // Process each entry
        for (const entry of entries) {
          try {
            // Ensure entry has required fields
            if (!entry._id) {
              logger.warn('Skipping entry without _id:', entry)
              continue
            }
            
            // Apply custom content parsing if provided
            const processedEntry = config.parseContent 
              ? config.parseContent(entry) 
              : entry
            
            // Generate a digest for change detection
            const digest = createHash('sha256')
              .update(JSON.stringify(processedEntry))
              .digest('hex')
            
            // Parse and validate the data
            const data = await parseData({
              id: entry._id,
              data: processedEntry
            })
            
            // Store the entry with digest for caching
            store.set({
              id: entry._id,
              data,
              digest
            })
            
          } catch (error) {
            logger.error(`Error processing entry ${entry._id}:`, error)
            continue
          }
        }
        
        // Update last sync time
        await meta.set('lastSync', currentTime)
        logger.info(`Content loading completed. Last sync: ${currentTime}`)
        
      } catch (error) {
        logger.error(`Failed to load Sanity content:`, error)
        throw error
      }
    }
  }
}

/**
 * Pre-configured loaders for common Sanity document types
 */
export const eventLoader = createSanityLoader({
  type: 'event',
  query: `*[_type == "event" && (
    publishingStatus == "published" ||
    (publishingStatus == "scheduled" &&
     now() >= scheduledPeriod.startDate &&
     now() <= scheduledPeriod.endDate)
  )] | order(eventDate->date asc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    content_no,
    content_en,
    eventTime{
      startTime,
      endTime
    },
    eventDate->{
      title_display_no,
      title_display_en,
      date
    },
    venue->{
      title,
      slug
    },
    genre->{
      title,
      slug
    },
    artist[]->{
      name,
      slug_no,
      slug_en
    },
    image{
      _type,
      asset,
      hotspot,
      crop,
      alt,
      caption
    },
    _updatedAt
  }`,
  parseContent: (entry) => ({
    ...entry,
    // Ensure slugs are properly formatted for both languages
    slug_no: entry.slug_no?.current || '',
    slug_en: entry.slug_en?.current || '',
    // Parse dates for better handling
    eventDate: entry.eventDate ? {
      ...entry.eventDate,
      date: new Date(entry.eventDate.date),
      title: entry.eventDate.title_display_no || entry.eventDate.title_display_en || ''
    } : null,
    lastUpdated: new Date(entry._updatedAt),
    // For compatibility, use Norwegian as default
    title: entry.title_no || entry.title_en || '',
    slug: entry.slug_no?.current || entry.slug_en?.current || '',
    excerpt: entry.excerpt_no || entry.excerpt_en || '',
    content: entry.content_no || entry.content_en || null,
    // Fix artists field name and add compatibility slug
    artists: entry.artist ? entry.artist.map(artist => ({
      ...artist,
      slug: artist.slug_no?.current || artist.slug_en?.current || ''
    })) : []
  })
})

export const artistLoader = createSanityLoader({
  type: 'artist',
  query: `*[_type == "artist" && (
    publishingStatus == "published" ||
    (publishingStatus == "scheduled" &&
     now() >= scheduledPeriod.startDate &&
     now() <= scheduledPeriod.endDate)
  )] | order(name asc) {
    _id,
    _type,
    name,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    instrument_no,
    instrument_en,
    content_no,
    content_en,
    image{
      _type,
      asset,
      hotspot,
      crop,
      alt,
      caption
    },
    websiteUrl,
    spotifyUrl,
    instagramUrl,
    _updatedAt
  }`,
  parseContent: (entry) => ({
    ...entry,
    // Ensure slugs are properly formatted for both languages
    slug_no: entry.slug_no?.current || '',
    slug_en: entry.slug_en?.current || '',
    lastUpdated: new Date(entry._updatedAt),
    // For compatibility, use Norwegian as default
    slug: entry.slug_no?.current || entry.slug_en?.current || '',
    bio: entry.excerpt_no || entry.excerpt_en || '',
    excerpt: entry.excerpt_no || entry.excerpt_en || '',
    instrument: entry.instrument_no || entry.instrument_en || '',
    content: entry.content_no || entry.content_en || null
  })
})

export const articleLoader = createSanityLoader({
  type: 'article',
  query: `*[_type == "article" && (
    publishingStatus == "published" ||
    (publishingStatus == "scheduled" &&
     now() >= scheduledPeriod.startDate &&
     now() <= scheduledPeriod.endDate)
  )] | order(_createdAt desc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    excerpt_no,
    excerpt_en,
    content_no,
    content_en,
    image{
      _type,
      asset,
      hotspot,
      crop,
      alt,
      caption
    },
    author->{
      name,
      image{
        ...,
        asset->{
          _id,
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            },
            lqip,
            palette{
              dominant{
                background,
                foreground
              }
            }
          }
        },
        hotspot,
        crop,
        alt
      }
    },
    _createdAt,
    _updatedAt
  }`,
  parseContent: (entry) => ({
    ...entry,
    // Ensure slugs are properly formatted for both languages
    slug_no: entry.slug_no?.current || '',
    slug_en: entry.slug_en?.current || '',
    publishedAt: new Date(entry._createdAt),
    lastUpdated: new Date(entry._updatedAt),
    // For compatibility, use Norwegian as default
    title: entry.title_no || entry.title_en || '',
    slug: entry.slug_no?.current || entry.slug_en?.current || '',
    excerpt: entry.excerpt_no || entry.excerpt_en || '',
    content: entry.content_no || entry.content_en || null
  })
})

export const venueLoader = createSanityLoader({
  type: 'venue',
  query: `*[_type == "venue"] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    linkText,
    linkUrl,
    openInNewTab,
    _updatedAt
  }`,
  parseContent: (entry) => ({
    ...entry,
    slug: entry.slug?.current || '',
    lastUpdated: new Date(entry._updatedAt)
  })
})

export const genreLoader = createSanityLoader({
  type: 'genre',
  query: `*[_type == "genre"] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    _updatedAt
  }`,
  parseContent: (entry) => ({
    ...entry,
    slug: entry.slug?.current || '',
    lastUpdated: new Date(entry._updatedAt)
  })
})

export const pageLoader = createSanityLoader({
  type: 'page',
  query: `*[_type == "page" && (
    publishingStatus == "published" ||
    (publishingStatus == "scheduled" &&
     now() >= scheduledPeriod.startDate &&
     now() <= scheduledPeriod.endDate)
  )] | order(_createdAt desc) {
    _id,
    _type,
    title_no,
    title_en,
    slug_no,
    slug_en,
    content_no,
    content_en,
    publishingStatus,
    scheduledPeriod,
    _createdAt,
    _updatedAt
  }`,
  parseContent: (entry) => ({
    ...entry,
    // Ensure slugs are properly formatted for both languages
    slug_no: entry.slug_no?.current || '',
    slug_en: entry.slug_en?.current || '',
    lastUpdated: new Date(entry._updatedAt),
    // For compatibility, use Norwegian as default
    title: entry.title_no || entry.title_en || '',
    slug: entry.slug_no?.current || entry.slug_en?.current || '',
    content: entry.content_no || entry.content_en || null
  })
})