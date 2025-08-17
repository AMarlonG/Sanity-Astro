/**
 * Astro 5 Content Collections Configuration with Sanity Content Layer
 */

import { defineCollection, z } from 'astro:content'
import { 
  eventLoader, 
  artistLoader, 
  articleLoader, 
  venueLoader, 
  genreLoader 
} from './lib/sanityLoader'

// Define schemas for type safety and validation
const eventSchema = z.object({
  _id: z.string(),
  _type: z.literal('event'),
  title: z.string(),
  slug: z.string(),
  eventTime: z.object({
    startTime: z.string(),
    endTime: z.string()
  }).optional(),
  eventDate: z.object({
    title: z.string(),
    date: z.date()
  }).optional(),
  venue: z.object({
    title: z.string(),
    slug: z.string()
  }).optional(),
  genre: z.object({
    title: z.string(),
    slug: z.string()
  }).optional(),
  artists: z.array(z.object({
    name: z.string(),
    slug: z.string()
  })).optional(),
  image: z.any().optional(),
  lastUpdated: z.date()
})

const artistSchema = z.object({
  _id: z.string(),
  _type: z.literal('artist'),
  name: z.string(),
  slug: z.string(),
  bio: z.any().optional(),
  image: z.any().optional(),
  websiteUrl: z.string().url().optional(),
  spotifyUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  lastUpdated: z.date()
})

const articleSchema = z.object({
  _id: z.string(),
  _type: z.literal('article'),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content: z.any().optional(),
  image: z.any().optional(),
  author: z.object({
    name: z.string(),
    image: z.any().optional()
  }).optional(),
  publishedAt: z.date(),
  lastUpdated: z.date()
})

const venueSchema = z.object({
  _id: z.string(),
  _type: z.literal('venue'),
  title: z.string(),
  slug: z.string(),
  linkText: z.string().optional(),
  linkUrl: z.string().url().optional(),
  openInNewTab: z.boolean().optional(),
  lastUpdated: z.date()
})

const genreSchema = z.object({
  _id: z.string(),
  _type: z.literal('genre'),
  title: z.string(),
  slug: z.string(),
  lastUpdated: z.date()
})

// Define content collections with custom Sanity loaders
export const collections = {
  events: defineCollection({
    loader: eventLoader,
    schema: eventSchema
  }),
  
  artists: defineCollection({
    loader: artistLoader,
    schema: artistSchema
  }),
  
  articles: defineCollection({
    loader: articleLoader,
    schema: articleSchema
  }),
  
  venues: defineCollection({
    loader: venueLoader,
    schema: venueSchema
  }),
  
  genres: defineCollection({
    loader: genreLoader,
    schema: genreSchema
  })
}