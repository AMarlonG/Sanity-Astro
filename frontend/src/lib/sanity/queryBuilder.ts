import {defineQuery} from 'groq'
import {createMultilingualField} from '../utils/language.js'

export interface QueryDefinition<P extends Record<string, unknown> = Record<string, unknown>> {
  query: ReturnType<typeof defineQuery>
  params: P
}

const EVENT_IMAGE_SELECTION = `
  "image": {
    "image": image,
    "alt": coalesce(imageAlt_no, imageAlt_en, image.alt),
    "credit": coalesce(imageCredit_no, imageCredit_en)
  }
`

const EVENT_DATE_SELECTION = `
  eventDate->{
    _id,
    date,
    title_display_no,
    title_display_en,
    "title": coalesce(title_display_no, title_display_en)
  }
`

const EVENT_BASE_FIELDS = `
  _id,
  _type,
  title_no,
  title_en,
  ${createMultilingualField('title')},
  slug_no,
  slug_en,
  "slug": coalesce(slug_no.current, slug_en.current, slug.current),
  ${createMultilingualField('excerpt')},
  ${EVENT_IMAGE_SELECTION},
  ${EVENT_DATE_SELECTION},
  eventTime,
  venue->{
    _id,
    title,
    name,
    address,
    city,
    "slug": slug.current
  },
  "artists": artist[]->{
    _id,
    name,
    "slug": slug.current,
    image,
    "imageAlt": coalesce(imageAlt_no, imageAlt_en)
  },
  "genre": genre->{
    _id,
    title,
    slug
  },
  ticketUrl,
  publishingStatus,
  scheduledPeriod,
  content_no,
  content_en,
  seo
`

const ARTIST_IMAGE_SELECTION = `
  "image": {
    "image": image,
    "alt": coalesce(imageAlt_no, imageAlt_en, image.alt),
    "credit": coalesce(imageCredit_no, imageCredit_en)
  }
`

const ARTIST_BASE_FIELDS = `
  _id,
  _type,
  name,
  ${createMultilingualField('excerpt')},
  instrument_no,
  instrument_en,
  "instrument": coalesce(instrument_no, instrument_en),
  country,
  ${ARTIST_IMAGE_SELECTION},
  slug,
  "slug": slug.current,
  content_no,
  content_en,
  publishingStatus,
  scheduledPeriod,
  seo
`

const ARTICLE_IMAGE_SELECTION = `
  "image": {
    "image": image,
    "alt": coalesce(imageAlt_no, imageAlt_en, image.alt),
    "credit": coalesce(imageCredit_no, imageCredit_en)
  }
`

const ARTICLE_BASE_FIELDS = `
  _id,
  _type,
  title_no,
  title_en,
  ${createMultilingualField('title')},
  slug_no,
  slug_en,
  "slug": coalesce(slug_no.current, slug_en.current, slug.current),
  ${createMultilingualField('excerpt')},
  ${ARTICLE_IMAGE_SELECTION},
  publishingStatus,
  scheduledPeriod,
  publishedAt,
  author->{
    _id,
    name,
    "slug": slug.current
  },
  content_no,
  content_en,
  seo
`

const SLUG_MATCH_FRAGMENT = `[$slug in [
  slug_no.current,
  slug_en.current,
  slug.current
]]`

// Queries
const HOMEPAGE_QUERY = defineQuery(`*[_type == "homepage" && (
  homePageType == "default" ||
  (homePageType == "scheduled" && defined(scheduledPeriod.startDate) && scheduledPeriod.startDate <= now() && scheduledPeriod.endDate >= now())
)] | order(homePageType desc)[0]{
  _id,
  _type,
  ${createMultilingualField('title')},
  title_no,
  title_en,
  content_no,
  content_en,
  homePageType,
  scheduledPeriod,
  seo
}`)

const PAGE_BY_SLUG_QUERY = defineQuery(`*[_type == "page" && ${SLUG_MATCH_FRAGMENT}][0]{
  _id,
  _type,
  ${createMultilingualField('title')},
  ${createMultilingualField('excerpt')},
  "slug": coalesce(slug_no.current, slug_en.current, slug.current),
  "slug_no": slug_no.current,
  "slug_en": slug_en.current,
  content_no,
  content_en,
  seo
}`)

const PROGRAM_PAGE_QUERY = defineQuery(`*[_type == "programPage"][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  content_no,
  content_en,
  seo,
  selectedEvents[]->{
    ${EVENT_BASE_FIELDS}
  }
}`)

const ARTIST_PAGE_QUERY = defineQuery(`*[_type == "artistPage"][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  content_no,
  content_en,
  seo,
  selectedArtists[]->{
    ${ARTIST_BASE_FIELDS},
    genres[]->{
      _id,
      title,
      slug
    }
  }
}`)

const EVENT_BY_SLUG_QUERY = defineQuery(`*[_type == "event" && ${SLUG_MATCH_FRAGMENT}][0]{
  ${EVENT_BASE_FIELDS}
}`)

const ARTIST_BY_SLUG_QUERY = defineQuery(`*[_type == "artist" && ${SLUG_MATCH_FRAGMENT}][0]{
  ${ARTIST_BASE_FIELDS},
  instagram,
  facebook,
  spotify,
  youtube,
  websiteUrl,
  spotifyUrl,
  instagramUrl
}`)

const ARTICLE_BY_SLUG_QUERY = defineQuery(`*[_type == "article" && ${SLUG_MATCH_FRAGMENT}][0]{
  ${ARTICLE_BASE_FIELDS}
}`)

const PUBLISHED_ARTICLES_QUERY = defineQuery(`*[_type == "article" && publishingStatus != "draft"] | order(publishedAt desc){
  ${ARTICLE_BASE_FIELDS}
}`)

const PUBLISHED_ARTISTS_QUERY = defineQuery(`*[_type == "artist" && publishingStatus != "draft"] | order(name asc){
  ${ARTIST_BASE_FIELDS}
}`)

const PUBLISHED_EVENTS_QUERY = defineQuery(`*[_type == "event" && publishingStatus == "published"] | order(eventDate->date asc, eventTime.startTime asc){
  ${EVENT_BASE_FIELDS}
}`)

const EVENT_DATES_QUERY = defineQuery(`*[_type == "eventDate" && isActive == true] | order(date asc){
  _id,
  date,
  title_display_no,
  title_display_en,
  "title": coalesce(title_display_no, title_display_en),
  slug_no,
  slug_en,
  "slug_no": slug_no.current,
  "slug_en": slug_en.current
}`)

const EVENTS_BY_DATE_QUERY = defineQuery(`*[_type == "event" && publishingStatus == "published" && eventDate._ref == $dateId] | order(eventTime.startTime asc){
  ${EVENT_BASE_FIELDS}
}`)

const SLUGS_FOR_TYPE_QUERY = defineQuery(`*[_type == $type && defined(slug.current)]{ "params": { "slug": slug.current } }`)

const SEARCH_CONTENT_QUERY = defineQuery(`*[_type in $types && (
  coalesce(title_no, title_en, title) match $search ||
  coalesce(excerpt_no, excerpt_en, excerpt) match $search
)] | order(_updatedAt desc){
  _id,
  _type,
  ${createMultilingualField('title')},
  ${createMultilingualField('excerpt')},
  "slug": coalesce(slug_no.current, slug_en.current, slug.current)
}`)

export const QueryBuilder = {
  homepage(): QueryDefinition {
    return {query: HOMEPAGE_QUERY, params: {}}
  },
  pageBySlug(slug: string): QueryDefinition<{slug: string}> {
    return {query: PAGE_BY_SLUG_QUERY, params: {slug}}
  },
  programPage(): QueryDefinition {
    return {query: PROGRAM_PAGE_QUERY, params: {}}
  },
  artistPage(): QueryDefinition {
    return {query: ARTIST_PAGE_QUERY, params: {}}
  },
  eventBySlug(slug: string): QueryDefinition<{slug: string}> {
    return {query: EVENT_BY_SLUG_QUERY, params: {slug}}
  },
  artistBySlug(slug: string): QueryDefinition<{slug: string}> {
    return {query: ARTIST_BY_SLUG_QUERY, params: {slug}}
  },
  articleBySlug(slug: string): QueryDefinition<{slug: string}> {
    return {query: ARTICLE_BY_SLUG_QUERY, params: {slug}}
  },
  publishedArticles(): QueryDefinition {
    return {query: PUBLISHED_ARTICLES_QUERY, params: {}}
  },
  publishedArtists(): QueryDefinition {
    return {query: PUBLISHED_ARTISTS_QUERY, params: {}}
  },
  publishedEvents(): QueryDefinition {
    return {query: PUBLISHED_EVENTS_QUERY, params: {}}
  },
  eventDates(): QueryDefinition {
    return {query: EVENT_DATES_QUERY, params: {}}
  },
  eventsByDate(dateId: string): QueryDefinition<{dateId: string}> {
    return {query: EVENTS_BY_DATE_QUERY, params: {dateId}}
  },
  slugsForType(type: string): QueryDefinition<{type: string}> {
    return {query: SLUGS_FOR_TYPE_QUERY, params: {type}}
  },
  searchContent(searchTerm: string, types: string[]): QueryDefinition<{search: string; types: string[]}> {
    return {query: SEARCH_CONTENT_QUERY, params: {search: `*${searchTerm}*`, types}}
  }
} as const

export interface QueryOptions {
  perspective?: 'published' | 'drafts'
  useCdn?: boolean
  token?: string
  stega?: boolean
}

export function buildQueryParams(options: QueryOptions = {}) {
  return {
    perspective: options.perspective || 'published',
    useCdn: options.useCdn ?? options.perspective === 'published',
    token: options.token,
    stega: options.stega || false
  }
}
