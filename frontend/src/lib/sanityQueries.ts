import { sanityClient } from 'sanity:client';

/**
 * Modern query utility that supports Visual Editing and draft mode
 */

export interface QueryOptions {
  perspective?: 'published' | 'drafts';
  useCdn?: boolean;
}

/**
 * Get the perspective based on preview mode
 */
export function getQueryPerspective(request?: Request): 'published' | 'drafts' {
  if (!request) return 'published';
  
  // Check for preview mode cookie
  const cookieHeader = request.headers.get('cookie');
  const hasPreviewMode = cookieHeader?.includes('sanity-preview-mode=true');
  
  return hasPreviewMode ? 'drafts' : 'published';
}

/**
 * Execute a Sanity query with Visual Editing support
 */
function executeQuery<T>(
  query: string, 
  params: Record<string, any> = {}, 
  perspective: 'published' | 'drafts' = 'published'
): Promise<T> {
  const visualEditingEnabled = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';
  const token = import.meta.env.SANITY_API_READ_TOKEN;

  // Require read token for visual editing
  if (visualEditingEnabled && !token) {
    throw new Error('SANITY_API_READ_TOKEN is required for Visual Editing');
  }

  return sanityClient.fetch(
    query, 
    params, 
    {
      perspective,
      useCdn: perspective === 'published' && !visualEditingEnabled,
      token: visualEditingEnabled ? token : undefined,
      stega: visualEditingEnabled,
      next: { revalidate: perspective === 'published' ? 60 : 0 }
    }
  );
}

/**
 * Load homepage with Visual Editing support
 */
export async function loadHomepage(request?: Request) {
  const perspective = getQueryPerspective(request);
  const now = new Date().toISOString();
  
  const scheduledQuery = `
    *[_type == "homepage" && 
      scheduledPeriod.startDate <= $now && 
      scheduledPeriod.endDate >= $now
    ] | order(scheduledPeriod.startDate desc)[0]{
      _id,
      title,
      content[]{
        _key,
        _type,
        // PortableText
        content,
        // HeadingComponent
        level,
        text,
        id,
        // Image
        image,
        alt,
        caption,
        // Video
        url,
        title,
        thumbnail,
        // Button
        text,
        style,
        size,
        action,
        // Link
        openInNewTab,
        // Quote
        quote,
        author,
        // Accordion
        // Content Scroll Container
        items,
        spacing,
        // Artist Scroll Container
        cardFormat,
        // Event Scroll Container
        events
      },
      isDefault,
      scheduledPeriod
    }
  `;

  try {
    // Try to get a scheduled homepage first
    const scheduledHomepage = await executeQuery(scheduledQuery, { now }, perspective);

    if (scheduledHomepage) {
      return { data: scheduledHomepage };
    }
  } catch (error) {
    console.error('Error fetching scheduled homepage:', error);
  }

  // Fall back to default homepage
  const defaultQuery = `
    *[_type == "homepage" && isDefault == true][0]{
      _id,
      title,
      content[]{
        _key,
        _type,
        // PortableText
        content,
        // HeadingComponent
        level,
        text,
        id,
        // Image
        image,
        alt,
        caption,
        // Video
        url,
        title,
        thumbnail,
        // Button
        text,
        style,
        size,
        action,
        // Link
        openInNewTab,
        // Quote
        quote,
        author,
        // Accordion
        // Content Scroll Container
        items,
        spacing,
        // Artist Scroll Container
        cardFormat,
        // Event Scroll Container
        events
      },
      isDefault,
      scheduledPeriod
    }
  `;

  const defaultHomepage = await executeQuery(defaultQuery, {}, perspective);
  return { data: defaultHomepage };
}

/**
 * Load artist by slug with Visual Editing support
 */
export async function loadArtist(slug: string, request?: Request) {
  const perspective = getQueryPerspective(request);
  
  const query = `
    *[_type == "artist" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      image,
      instrument,
      country,
      website,
      socialMedia,
      content,
      publishingStatus,
      scheduledPeriod
    }
  `;

  const data = await executeQuery(query, { slug }, perspective);
  return { data };
}

/**
 * Load event by slug with Visual Editing support
 */
export async function loadEvent(slug: string, request?: Request) {
  const perspective = getQueryPerspective(request);
  
  const query = `
    *[_type == "event" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      image,
      description,
      buttonText,
      buttonUrl,
      buttonOpenInNewTab,
      content,
      artist[]->{
        _id,
        name,
        slug,
        image,
        instrument,
        content
      },
      venue->{
        _id,
        title,
        linkText,
        linkUrl,
        address,
        city
      },
      genre->{
        _id,
        title,
        color
      },
      eventDate->{
        _id,
        title,
        date
      },
      eventTime,
      ticketUrl,
      isFeatured,
      publishingStatus,
      scheduledPeriod
    }
  `;

  const data = await executeQuery(query, { slug }, perspective);
  return { data };
}

/**
 * Load article by slug with Visual Editing support
 */
export async function loadArticle(slug: string, request?: Request) {
  const perspective = getQueryPerspective(request);
  
  const query = `
    *[_type == "article" && slug.current == $slug][0]{
      _id,
      title,
      subtitle,
      slug,
      excerpt,
      content,
      mainImage,
      author,
      publishedAt,
      categories,
      tags,
      publishingStatus,
      scheduledPeriod
    }
  `;

  const data = await executeQuery(query, { slug }, perspective);
  return { data };
}

/**
 * Load page by slug with Visual Editing support
 */
export async function loadPage(slug: string, request?: Request) {
  const perspective = getQueryPerspective(request);
  
  const query = `
    *[_type == "page" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      content,
      publishingStatus,
      scheduledPeriod
    }
  `;

  const data = await executeQuery(query, { slug }, perspective);
  return { data };
}