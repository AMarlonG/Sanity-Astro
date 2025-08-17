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
  description?: any[];
  image?: SanityImage;
  url?: string;
  instagram?: string;
  facebook?: string;
  spotify?: string;
  youtube?: string;
}

export interface Event extends SanityDocument {
  _type: 'event';
  title: string;
  slug: { current: string };
  eventDates?: EventDate[];
  artists?: Artist[];
  description?: any[];
  image?: SanityImage;
  venue?: Venue;
  genres?: Genre[];
  ticketUrl?: string;
  isFeatured?: boolean;
}

export interface EventDate {
  _key: string;
  date: string;
  startTime?: string;
  endTime?: string;
  doorsOpen?: string;
}

export interface Venue extends SanityDocument {
  _type: 'venue';
  name: string;
  slug: { current: string };
  address?: string;
  city?: string;
  capacity?: number;
  description?: any[];
  image?: SanityImage;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Genre extends SanityDocument {
  _type: 'genre';
  name: string;
  slug: { current: string };
  description?: string;
  color?: string;
}

export interface Article extends SanityDocument {
  _type: 'article';
  title: string;
  slug: { current: string };
  excerpt?: string;
  content?: any[];
  mainImage?: SanityImage;
  author?: string;
  publishedAt?: string;
  categories?: string[];
  tags?: string[];
}

export interface Homepage extends SanityDocument {
  _type: 'homepage';
  title: string;
  content?: any[];
  isDefault?: boolean;
  scheduledPeriod?: {
    startDate: string;
    endDate: string;
  };
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