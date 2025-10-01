/**
 * Type-safe GROQ query builder for consistent data fetching with multilingual support
 */

import { createMultilingualField, createMultilingualSlug, type Language } from '../utils/language.js';

// Shared component query fragment - reusable for both content and content_no/content_en
const COMPONENT_QUERY_FRAGMENT = `
    _key,
    _type,
    _type == "title" => {
      mainTitle,
      subtitle
    },
    _type == "headingComponent" => {
      text,
      level,
      alignment,
      id
    },
    _type == "portableTextBlock" => {
      title,
      content
    },
    _type == "imageComponent" => {
      image{
        asset->{
          _id,
          url
        }
      },
      alt,
      caption,
      credit,
      size,
      aspectRatio,
      alignment
    },
    _type == "videoComponent" => {
      url,
      title,
      autoplay,
      controls,
      thumbnail
    },
    _type == "quoteComponent" => {
      quote,
      author
    },
    _type == "buttonComponent" => {
      text,
      url,
      variant,
      style,
      size,
      action
    },
    _type == "linkComponent" => {
      text,
      url,
      linkType,
      internalLink,
      openInNewTab
    },
    _type == "accordionComponent" => {
      title,
      description,
      panels[]
    },
    _type == "countdownComponent" => {
      title,
      targetEvent,
      style
    },
    _type == "columnLayout" => {
      layoutType,
      desktopColumns,
      containerWidth,
      items
    },
    _type == "gridLayout" => {
      gridTemplate,
      gridItems
    },
    _type == "spacer" => {
      type,
      size,
      showDivider
    },
    _type == "contentScrollContainer" => {
      title,
      items[]{
        _key,
        _type,
        _type == "imageComponent" => {
          image{
            asset->{
              _id,
              url
            }
          },
          alt,
          caption,
          credit
        },
        _type == "videoComponent" => {
          url,
          title
        },
        _type == "quoteComponent" => {
          quote,
          author
        }
      },
      format,
      showScrollbar
    },
    _type == "artistScrollContainer" => {
      title,
      items[]->{
        name,
        slug_no,
        slug_en,
        image,
        excerpt_no,
        excerpt_en,
        genres[]->{title}
      },
      showScrollbar,
      cardFormat
    },
    _type == "eventScrollContainer" => {
      title,
      items[]->{
        title,
        "slug": slug.current,
        eventDate->{date},
        eventTime,
        venue->{title},
        image
      },
      showScrollbar,
      cardFormat
    }
`;

// PageBuilder content query using shared fragment
const CONTENT_QUERY = `
  content[]{
    ${COMPONENT_QUERY_FRAGMENT}
    _type == "title" => {
      mainTitle,
      subtitle
    },
    _type == "headingComponent" => {
      text,
      level,
      alignment,
      id
    },
    _type == "portableTextBlock" => {
      title,
      content
    },
    _type == "imageComponent" => {
      image{
        asset->{
          _id,
          url
        }
      },
      alt,
      caption,
      credit,
      size,
      aspectRatio,
      alignment
    },
    _type == "videoComponent" => {
      url,
      title,
      autoplay,
      controls,
      thumbnail
    },
    _type == "quoteComponent" => {
      quote,
      author
    },
    _type == "buttonComponent" => {
      text,
      url,
      variant,
      style,
      size,
      action
    },
    _type == "linkComponent" => {
      text,
      url,
      linkType,
      internalLink,
      openInNewTab
    },
    _type == "accordionComponent" => {
      title,
      description,
      panels[]
    },
    _type == "countdownComponent" => {
      title,
      targetEvent,
      style
    },
    _type == "columnLayout" => {
      layoutType,
      desktopColumns,
      containerWidth,
      items
    },
    _type == "gridLayout" => {
      gridTemplate,
      gridItems
    },
    _type == "spacer" => {
      type,
      size,
      showDivider
    },
    _type == "contentScrollContainer" => {
      title,
      items[]{
        _key,
        _type,
        _type == "imageComponent" => {
          image{
            asset->{
              _id,
              url
            }
          },
          alt,
          caption,
          credit
        },
        _type == "videoComponent" => {
          url,
          title
        },
        _type == "quoteComponent" => {
          quote,
          author
        }
      },
      format,
      showScrollbar
    },
    _type == "artistScrollContainer" => {
      title,
      items[]->{
        name,
        slug_no,
        slug_en,
        image,
        excerpt_no,
        excerpt_en,
        genres[]->{title}
      },
      showScrollbar,
      cardFormat
    },
    _type == "eventScrollContainer" => {
      title,
      items[]->{
        title,
        "slug": slug.current,
        eventDate->{date},
        eventTime,
        venue->{title},
        image
      },
      showScrollbar,
      cardFormat
    }
  }
`;

// Common query parameters
export interface QueryOptions {
  perspective?: 'published' | 'drafts';
  useCdn?: boolean;
  token?: string;
  stega?: boolean;
}

// Base query builders
export const QueryBuilder = {
  // Homepage queries
  homepage: () => `
    *[_type == "homepage" && (homePageType == "default" ||
      (homePageType == "scheduled" &&
       scheduledPeriod.startDate <= now() &&
       scheduledPeriod.endDate >= now()))] | order(homePageType desc)[0]{
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      homePageType,
      scheduledPeriod,
      ${MULTILINGUAL_CONTENT_QUERY}
    }
  `,

  // Page queries
  pageBySlug: (slug: string) => `
    *[_type == "page" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0] {
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      ${MULTILINGUAL_CONTENT_QUERY}
    }
  `,

  // Program page query
  programPage: () => `
    *[_type == "programPage"][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      ${MULTILINGUAL_CONTENT_QUERY},
      selectedEvents[]->{
        _id,
        title,
        "slug": slug.current,
        eventDate->{date, title},
        eventTime,
        venue->{name},
        artist[]->{name},
        image{
          asset->{url},
          alt
        },
        genre->{title},
        price
      }
    }
  `,

  // Artist page query
  artistPage: () => `
    *[_type == "artistPage"][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      ${MULTILINGUAL_CONTENT_QUERY},
      selectedArtists[]->{
        _id,
        name,
        "slug": slug.current,
        excerpt,
        instrument,
        country,
        image{
          asset->{url},
          alt
        },
        genres[]->{title}
      }
    }
  `,

  // Dynamic content queries
  contentByType: (contentType: string, orderBy: string = '_createdAt desc') => `
    *[_type == "${contentType}"] | order(${orderBy}) {
      _id,
      title,
      "slug": slug.current,
      _createdAt,
      _updatedAt,
      isPublished
    }
  `,

  // Detailed content queries
  articleBySlug: (slug: string) => `
    *[_type == "article" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0]{
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      ${MULTILINGUAL_CONTENT_QUERY},
      publishedAt,
      author->{
        name,
        slug
      },
      categories[]->{
        title,
        slug
      }
    }
  `,

  artistBySlug: (slug: string) => `
    *[_type == "artist" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0]{
      _id,
      name,
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      instrument,
      country,
      image{
        asset->{
          _id,
          url
        }
      },
      imageCredit,
      imageAlt,
      imageCaption,
      ${MULTILINGUAL_CONTENT_QUERY}
    }
  `,

  eventBySlug: (slug: string) => `
    *[_type == "event" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0]{
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      description_no,
      description_en,
      ${createMultilingualField('description')},
      eventDate->{
        date
      },
      eventTime,
      venue->{
        _id,
        name,
        address,
        city
      },
      artist[]->{
        _id,
        name,
        "slug": slug.current,
        image{
          asset->{url},
          alt
        }
      },
      image{
        asset->{url},
        alt
      },
      ticketUrl,
      price,
      isPublished
    }
  `,

  // List queries with filtering
  publishedEvents: () => `
    *[_type == "event" && isPublished == true] | order(eventDate->date asc) {
      _id,
      title,
      "slug": slug.current,
      eventDate->{date},
      eventTime,
      venue->{name},
      artist[]->{name},
      image{
        asset->{url},
        alt
      },
      price
    }
  `,

  publishedArtists: () => `
    *[_type == "artist"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      image{
        asset->{url},
        alt
      },
      genres[]->{title}
    }
  `,

  publishedArticles: () => `
    *[_type == "article"] | order(_createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      author->{name},
      image{
        asset->{url},
        alt
      }
    }
  `,

  // Utility queries
  slugsForType: (contentType: string) => `
    *[_type == "${contentType}" && defined(slug.current)]{
      "params": {"slug": slug.current}
    }
  `,

  // Event-specific queries
  eventDates: () => `
    *[_type == "eventDate" && isActive == true] | order(date asc)
  `,

  eventsByDate: (dateId: string) => `
    *[_type == "event" && isPublished == true && eventDate._ref == "${dateId}"] | order(eventTime asc) {
      _id,
      title,
      "slug": slug.current,
      eventTime,
      venue->{name},
      artist[]->{name},
      image{
        asset->{url},
        alt
      }
    }
  `,

  // Search and filtering
  searchContent: (searchTerm: string, types: string[] = ['article', 'event', 'artist']) => `
    *[_type in [${types.map(t => `"${t}"`).join(', ')}] && (
      title match "*${searchTerm}*" ||
      description match "*${searchTerm}*"
    )] | order(_score desc) {
      _id,
      _type,
      title,
      "slug": slug.current,
      description,
      image{
        asset->{url},
        alt
      }
    }
  `,

  // OPTIMIZED LIST QUERIES - Light queries for fast list views
  eventsListLight: () => `
    *[_type == "event" && (
      publishingStatus == "published" ||
      (publishingStatus == "scheduled" &&
       now() >= scheduledPeriod.startDate &&
       now() <= scheduledPeriod.endDate)
    )] | order(eventDate->date asc) {
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      eventDate->{
        title_display_no,
        title_display_en,
        date
      },
      eventTime{
        startTime,
        endTime
      },
      venue->{
        title,
        slug
      },
      genre->{
        title,
        slug
      }
    }
  `,

  artistsListLight: () => `
    *[_type == "artist" && (
      publishingStatus == "published" ||
      (publishingStatus == "scheduled" &&
       now() >= scheduledPeriod.startDate &&
       now() <= scheduledPeriod.endDate)
    )] | order(name asc) {
      _id,
      name,
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      instrument_no,
      instrument_en,
      image{
        asset->{
          _id,
          url
        },
        alt
      }
    }
  `,

  articlesListLight: () => `
    *[_type == "article" && (
      publishingStatus == "published" ||
      (publishingStatus == "scheduled" &&
       now() >= scheduledPeriod.startDate &&
       now() <= scheduledPeriod.endDate)
    )] | order(_createdAt desc) {
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      _createdAt,
      author->{
        name,
        slug
      },
      image{
        asset->{url},
        alt
      }
    }
  `,

  // DETAILED QUERIES - Full content for detail pages
  eventDetailBySlug: (slug: string) => `
    *[_type == "event" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0]{
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      ${MULTILINGUAL_CONTENT_QUERY},
      eventDate->{
        title_display_no,
        title_display_en,
        date
      },
      eventTime{
        startTime,
        endTime
      },
      venue->{
        _id,
        title,
        "slug": slug.current,
        address,
        linkUrl,
        linkText
      },
      artist[]->{
        _id,
        name,
        slug_no,
        slug_en,
        image{
          asset->{url},
          alt
        }
      },
      image{
        asset->{
          _id,
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            },
            lqip
          }
        },
        hotspot,
        crop,
        alt,
        caption,
        credit
      },
      genre->{
        title,
        slug
      },
      ticketUrl,
      publishingStatus,
      scheduledPeriod,
      _createdAt,
      _updatedAt
    }
  `,

  artistDetailBySlug: (slug: string) => `
    *[_type == "artist" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0]{
      _id,
      name,
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      instrument_no,
      instrument_en,
      country,
      ${MULTILINGUAL_CONTENT_QUERY},
      image{
        asset->{
          _id,
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            },
            lqip
          }
        },
        hotspot,
        crop,
        alt,
        caption,
        credit
      },
      websiteUrl,
      spotifyUrl,
      instagramUrl,
      publishingStatus,
      scheduledPeriod,
      _createdAt,
      _updatedAt
    }
  `,

  articleDetailBySlug: (slug: string) => `
    *[_type == "article" && (slug_no.current == "${slug}" || slug_en.current == "${slug}" || slug.current == "${slug}")][0]{
      _id,
      title_no,
      title_en,
      ${createMultilingualField('title')},
      ${COMMON_FRAGMENTS.multilingualSlugFields},
      excerpt_no,
      excerpt_en,
      ${createMultilingualField('excerpt')},
      ${MULTILINGUAL_CONTENT_QUERY},
      author->{
        name,
        "slug": slug.current,
        image{
          asset->{url},
          alt
        }
      },
      image{
        asset->{
          _id,
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            },
            lqip
          }
        },
        hotspot,
        crop,
        alt,
        caption,
        credit
      },
      categories[]->{
        title,
        slug
      },
      publishingStatus,
      scheduledPeriod,
      _createdAt,
      _updatedAt
    }
  `
};

// Type-safe query execution helpers
export function buildQuery(queryName: keyof typeof QueryBuilder, ...params: any[]): string {
  const queryFn = QueryBuilder[queryName];
  if (typeof queryFn === 'function') {
    return queryFn(...params);
  }
  throw new Error(`Query "${queryName}" not found or is not a function`);
}

// Query parameter builders
export function buildQueryParams(options: QueryOptions = {}): any {
  return {
    perspective: options.perspective || 'published',
    useCdn: options.useCdn ?? (options.perspective === 'published'),
    token: options.token,
    stega: options.stega || false
  };
}

// Multilingual field helpers
function createMultilingualFields(): string {
  return `
    ${createMultilingualField('title')},
    ${createMultilingualField('content')},
    ${createMultilingualField('excerpt')},
    ${createMultilingualField('description')},
    ${createMultilingualSlug()}
  `;
}

// Content query with multilingual support
const MULTILINGUAL_CONTENT_QUERY = `
  content_no[]{
    _key,
    _type,
    _type == "title" => {
      mainTitle,
      subtitle
    },
    _type == "headingComponent" => {
      text,
      level,
      alignment,
      id
    },
    _type == "portableTextBlock" => {
      title,
      content
    },
    _type == "imageComponent" => {
      image{
        asset->{
          _id,
          url
        }
      },
      alt,
      caption,
      credit,
      size,
      aspectRatio,
      alignment
    },
    _type == "videoComponent" => {
      url,
      title,
      autoplay,
      controls,
      thumbnail
    },
    _type == "quoteComponent" => {
      quote,
      author
    },
    _type == "buttonComponent" => {
      text,
      url,
      variant,
      style,
      size,
      action
    },
    _type == "linkComponent" => {
      text,
      url,
      linkType,
      internalLink,
      openInNewTab
    },
    _type == "accordionComponent" => {
      title,
      description,
      panels[]
    },
    _type == "countdownComponent" => {
      title,
      targetEvent,
      style
    },
    _type == "columnLayout" => {
      layoutType,
      desktopColumns,
      containerWidth,
      items
    },
    _type == "gridLayout" => {
      gridTemplate,
      gridItems
    },
    _type == "spacer" => {
      type,
      size,
      showDivider
    },
    _type == "contentScrollContainer" => {
      title,
      items[]{
        _key,
        _type,
        _type == "imageComponent" => {
          image{
            asset->{
              _id,
              url
            }
          },
          alt,
          caption,
          credit
        },
        _type == "videoComponent" => {
          url,
          title
        },
        _type == "quoteComponent" => {
          quote,
          author
        }
      },
      format,
      showScrollbar
    },
    _type == "artistScrollContainer" => {
      title,
      items[]->{
        name,
        slug_no,
        slug_en,
        image,
        excerpt_no,
        excerpt_en,
        genres[]->{title}
      },
      showScrollbar,
      cardFormat
    },
    _type == "eventScrollContainer" => {
      title,
      items[]->{
        title,
        "slug": slug.current,
        eventDate->{date},
        eventTime,
        venue->{title},
        image
      },
      showScrollbar,
      cardFormat
    }
  },
  content_en[]{
    _key,
    _type,
    _type == "title" => {
      mainTitle,
      subtitle
    },
    _type == "headingComponent" => {
      text,
      level,
      alignment,
      id
    },
    _type == "portableTextBlock" => {
      title,
      content
    },
    _type == "imageComponent" => {
      image{
        asset->{
          _id,
          url
        }
      },
      alt,
      caption,
      credit,
      size,
      aspectRatio,
      alignment
    },
    _type == "videoComponent" => {
      url,
      title,
      autoplay,
      controls,
      thumbnail
    },
    _type == "quoteComponent" => {
      quote,
      author
    },
    _type == "buttonComponent" => {
      text,
      url,
      variant,
      style,
      size,
      action
    },
    _type == "linkComponent" => {
      text,
      url,
      linkType,
      internalLink,
      openInNewTab
    },
    _type == "accordionComponent" => {
      title,
      description,
      panels[]
    },
    _type == "countdownComponent" => {
      title,
      targetEvent,
      style
    },
    _type == "columnLayout" => {
      layoutType,
      desktopColumns,
      containerWidth,
      items
    },
    _type == "gridLayout" => {
      gridTemplate,
      gridItems
    },
    _type == "spacer" => {
      type,
      size,
      showDivider
    },
    _type == "contentScrollContainer" => {
      title,
      items[]{
        _key,
        _type,
        _type == "imageComponent" => {
          image{
            asset->{
              _id,
              url
            }
          },
          alt,
          caption,
          credit
        },
        _type == "videoComponent" => {
          url,
          title
        },
        _type == "quoteComponent" => {
          quote,
          author
        }
      },
      format,
      showScrollbar
    },
    _type == "artistScrollContainer" => {
      title,
      items[]->{
        name,
        slug_no,
        slug_en,
        image,
        excerpt_no,
        excerpt_en,
        genres[]->{title}
      },
      showScrollbar,
      cardFormat
    },
    _type == "eventScrollContainer" => {
      title,
      items[]->{
        title,
        "slug": slug.current,
        eventDate->{date},
        eventTime,
        venue->{title},
        image
      },
      showScrollbar,
      cardFormat
    }
  },
  ${createMultilingualField('content')}
`;

// Common query fragments for reuse
export const COMMON_FRAGMENTS = {
  imageFields: `
    image{
      asset->{url, metadata},
      alt,
      caption
    }
  `,

  slugFields: `
    slug{
      current
    }
  `,

  multilingualSlugFields: `
    slug_no{
      current
    },
    slug_en{
      current
    },
    ${createMultilingualSlug()}
  `,

  referenceFields: `
    _id,
    _type,
    title,
    slug
  `,

  multilingualReferenceFields: `
    _id,
    _type,
    title_no,
    title_en,
    ${createMultilingualField('title')},
    slug_no,
    slug_en,
    ${createMultilingualSlug()}
  `
};