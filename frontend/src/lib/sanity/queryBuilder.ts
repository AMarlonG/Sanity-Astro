import {defineQuery} from 'groq'
import {createMultilingualField, type Language} from '../utils/language.js'

export interface QueryDefinition<P extends Record<string, unknown> = Record<string, unknown>> {
  query: ReturnType<typeof defineQuery>
  params: P
}

const MAX_CONTENT_DEPTH = 2

const buildContentProjection = (depth = 0): string => {
  if (depth >= MAX_CONTENT_DEPTH) {
    return '...'
  }

  const nested = buildContentProjection(depth + 1)

  return `
    ...,
    _type == "linkComponent" => {
      ...,
      "internalLink": select(
        linkType == "internal" && defined(internalLink) => internalLink->{
          _type,
          "slug": coalesce(slug_no.current, slug_en.current, slug.current),
          "slug_no": slug_no.current,
          "slug_en": slug_en.current
        },
        defined(internalLink) => internalLink
      )
    },
    _type == "columnLayout" => {
      ...,
      items[]{${nested}}
    },
    _type == "gridLayout" => {
      ...,
      gridItems[]{${nested}}
    },
    _type == "contentScrollContainer" => {
      ...,
      items[]{${nested}}
    },
    _type == "artistScrollContainer" => {
      ...,
      items[]{${nested}}
    },
    _type == "eventScrollContainer" => {
      ...,
      items[]{${nested}}
    },
    _type == "accordionComponent" => {
      ...,
      panels[]{
        ...,
        content[]{${nested}}
      }
    }
  `
}

const PAGE_CONTENT_WITH_LINKS = buildContentProjection()

const EVENT_IMAGE_SELECTION = `
  "image": {
    "image": image{
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          },
          lqip
        }
      },
      hotspot,
      crop
    },
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
  excerpt_no,
  excerpt_en,
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
    slug_no,
    slug_en,
    "slug": coalesce(slug_no.current, slug_en.current, slug.current),
    image,
    "imageAlt": coalesce(imageAlt_no, imageAlt_en)
  },
  "genre": genre->{
    _id,
    title,
    slug
  },
  ticketType,
  ticketUrl,
  publishingStatus,
  scheduledPeriod,
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  seo
`

const ARTIST_IMAGE_SELECTION = `
  "image": {
    "image": image{
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          },
          lqip
        }
      },
      hotspot,
      crop
    },
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
  slug_no,
  slug_en,
  "slug": coalesce(slug_no.current, slug_en.current, slug.current),
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  publishingStatus,
  scheduledPeriod,
  seo
`

const ARTICLE_IMAGE_SELECTION = `
  "image": {
    "image": image{
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          },
          lqip
        }
      },
      hotspot,
      crop
    },
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
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  seo
`

// Language-aware slug matching helper
const buildSlugMatch = (language: Language = 'no'): string => {
  if (language === 'en') {
    // For English: prioritize slug_en, fallback to slug_no and legacy slug
    return `[$slug in [slug_en.current, slug_no.current, slug.current]]`
  }
  // For Norwegian (default): prioritize slug_no, fallback to slug_en and legacy slug
  return `[$slug in [slug_no.current, slug_en.current, slug.current]]`
}

// Helper to get correct slug projection based on language
const buildSlugProjection = (language: Language = 'no'): string => {
  if (language === 'en') {
    return `"slug": coalesce(slug_en.current, slug_no.current, slug.current)`
  }
  return `"slug": coalesce(slug_no.current, slug_en.current, slug.current)`
}

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
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  homePageType,
  scheduledPeriod,
  seo
}`)

// Language-aware query builders
const buildPageBySlugQuery = (language: Language = 'no') => defineQuery(`*[_type == "page" && ${buildSlugMatch(language)}][0]{
  _id,
  _type,
  ${createMultilingualField('title')},
  ${createMultilingualField('excerpt')},
  ${buildSlugProjection(language)},
  "slug_no": slug_no.current,
  "slug_en": slug_en.current,
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  seo
}`)

const PROGRAM_PAGE_QUERY = defineQuery(`*[_type == "programPage"][0]{
  _id,
  _type,
  ${createMultilingualField('title')},
  "slug": slug.current,
  ${createMultilingualField('excerpt')},
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
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
  content_no[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
  content_en[]{
    ${PAGE_CONTENT_WITH_LINKS}
  },
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

const buildEventBySlugQuery = (language: Language = 'no') => defineQuery(`*[_type == "event" && ${buildSlugMatch(language)}][0]{
  ${EVENT_BASE_FIELDS}
}`)

const buildArtistBySlugQuery = (language: Language = 'no') => defineQuery(`*[_type == "artist" && ${buildSlugMatch(language)}][0]{
  ${ARTIST_BASE_FIELDS},
  instagram,
  facebook,
  spotify,
  youtube,
  websiteUrl,
  spotifyUrl,
  instagramUrl
}`)

const buildArticleBySlugQuery = (language: Language = 'no') => defineQuery(`*[_type == "article" && ${buildSlugMatch(language)}][0]{
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
  pageBySlug(slug: string, language: Language = 'no'): QueryDefinition<{slug: string}> {
    return {query: buildPageBySlugQuery(language), params: {slug}}
  },
  programPage(): QueryDefinition {
    return {query: PROGRAM_PAGE_QUERY, params: {}}
  },
  artistPage(): QueryDefinition {
    return {query: ARTIST_PAGE_QUERY, params: {}}
  },
  eventBySlug(slug: string, language: Language = 'no'): QueryDefinition<{slug: string}> {
    return {query: buildEventBySlugQuery(language), params: {slug}}
  },
  artistBySlug(slug: string, language: Language = 'no'): QueryDefinition<{slug: string}> {
    return {query: buildArtistBySlugQuery(language), params: {slug}}
  },
  articleBySlug(slug: string, language: Language = 'no'): QueryDefinition<{slug: string}> {
    return {query: buildArticleBySlugQuery(language), params: {slug}}
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
