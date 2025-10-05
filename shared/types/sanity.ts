// Shared Sanity types for both Studio and Frontend

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface Artist extends SanityDocument {
  _type: 'artist';
  name: string;
  slug: { current: string };
  excerpt_no?: string;
  excerpt_en?: string;
  instrument_no?: string;
  instrument_en?: string;
  country?: string;
  image?: SanityImage;
  imageAlt_no?: string;
  imageAlt_en?: string;
  content_no?: any[];
  content_en?: any[];
  instagram?: string;
  facebook?: string;
  spotify?: string;
  youtube?: string;
  websiteUrl?: string;
  spotifyUrl?: string;
  instagramUrl?: string;
  publishingStatus?: 'published' | 'draft' | 'scheduled';
  scheduledPeriod?: {
    startDate?: string;
    endDate?: string;
  };
}

export interface Event extends SanityDocument {
  _type: 'event';
  title_no?: string;
  title_en?: string;
  slug_no?: { current: string };
  slug_en?: { current: string };
  excerpt_no?: string;
  excerpt_en?: string;
  content_no?: any[];
  content_en?: any[];
  image?: SanityImage;
  imageAlt_no?: string;
  imageAlt_en?: string;
  eventDate?: {
    _ref: string;
  };
  eventTime?: {
    startTime?: string;
    endTime?: string;
  };
  venue?: {
    _ref: string;
  };
  artist?: Array<{ _ref: string }>;
  genre?: { _ref: string };
  ticketUrl?: string;
  publishingStatus?: 'published' | 'draft' | 'scheduled';
  scheduledPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  seo?: Record<string, unknown>;
}

export interface EventDate extends SanityDocument {
  _type: 'eventDate';
  date: string;
  title_display_no?: string;
  title_display_en?: string;
  slug_no?: { current: string };
  slug_en?: { current: string };
  isActive?: boolean;
}

export interface Venue extends SanityDocument {
  _type: 'venue';
  title: string;
  slug: { current: string };
  address?: string;
  city?: string;
  linkUrl?: string;
  openInNewTab?: boolean;
}

export interface Article extends SanityDocument {
  _type: 'article';
  title_no?: string;
  title_en?: string;
  slug_no?: { current: string };
  slug_en?: { current: string };
  excerpt_no?: string;
  excerpt_en?: string;
  content_no?: any[];
  content_en?: any[];
  image?: SanityImage;
  imageAlt_no?: string;
  imageAlt_en?: string;
  publishingStatus?: 'published' | 'draft' | 'scheduled';
  scheduledPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  publishedAt?: string;
  author?: { _ref: string } | string;
  seo?: Record<string, unknown>;
}

export interface Homepage extends SanityDocument {
  _type: 'homepage';
  adminTitle?: string;
  title_no?: string;
  title_en?: string;
  content_no?: any[];
  content_en?: any[];
  homePageType?: 'default' | 'scheduled';
  scheduledPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  seo?: Record<string, unknown>;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
}

export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: string;
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    [key: string]: any;
  }>;
  level?: number;
  listItem?: string;
}
