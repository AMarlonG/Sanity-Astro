/**
 * Type-safe GROQ query builder for consistent data fetching
 */

// PageBuilder content query
const CONTENT_QUERY = `
  content[]{
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
        slug,
        image,
        bio,
        genres[]->{title}
      },
      showScrollbar,
      cardFormat
    },
    _type == "eventScrollContainer" => {
      title,
      items[]->{
        title,
        slug,
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
      title,
      homePageType,
      scheduledPeriod,
      ${CONTENT_QUERY}
    }
  `,

  // Page queries
  pageBySlug: (slug: string) => `
    *[_type == "page" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      ${CONTENT_QUERY}
    }
  `,

  // Program page query
  programPage: () => `
    *[_type == "programPage"][0] {
      _id,
      title,
      slug,
      excerpt,
      ${CONTENT_QUERY}
    }
  `,

  // Artist page query
  artistPage: () => `
    *[_type == "artistPage"][0] {
      _id,
      title,
      slug,
      excerpt,
      ${CONTENT_QUERY}
    }
  `,

  // Dynamic content queries
  contentByType: (contentType: string, orderBy: string = '_createdAt desc') => `
    *[_type == "${contentType}"] | order(${orderBy}) {
      _id,
      title,
      slug,
      _createdAt,
      _updatedAt,
      isPublished
    }
  `,

  // Detailed content queries
  articleBySlug: (slug: string) => `
    *[_type == "article" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      excerpt,
      ${CONTENT_QUERY},
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
    *[_type == "artist" && slug.current == "${slug}"][0]{
      _id,
      name,
      slug,
      excerpt,
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
      ${CONTENT_QUERY}
    }
  `,

  eventBySlug: (slug: string) => `
    *[_type == "event" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      description,
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
      artists[]->{
        _id,
        name,
        slug,
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
      slug,
      eventDate->{date},
      eventTime,
      venue->{name},
      artists[]->{name},
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
      slug,
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
      slug,
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
      slug,
      eventTime,
      venue->{name},
      artists[]->{name},
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
      slug,
      description,
      image{
        asset->{url},
        alt
      }
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

  referenceFields: `
    _id,
    _type,
    title,
    slug
  `
};