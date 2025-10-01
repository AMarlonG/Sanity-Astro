export const prerender = false;
import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import {
  rateLimit,
  validateContentType,
  InputValidator,
  getCORSHeaders,
  getSecurityHeaders
} from '../../lib/security';
import { formatDateForLanguage } from '../../../../shared/utils/dates';
import type {
  EventFilterFormData,
  FormSubmissionResult,
  FormSecurityCheck
} from '../../lib/form-utils'
import {
  validateFormData,
  eventFilterFormFields,
  formDataProcessors
} from '../../lib/form-utils'

// Type for arrangement hentet fra Sanity
interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  eventTime?: {
    startTime: string;
    endTime: string;
  };
  eventDate?: {
    title: string;
    date: string;
  };
  venue?: {
    title: string;
    slug: { current: string };
  };
  genre?: {
    title: string;
    slug: { current: string };
  };
  artists?: Array<{
    name: string;
    slug: { current: string };
  }>;
  image?: {
    image?: any;
    alt?: string;
    caption?: string;
    credit?: string;
    aspectRatio?: string;
    alignment?: string;
    size?: string;
  };
}

// Opprett Sanity Image URL Builder
const { projectId, dataset } = sanityClient.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// Enhanced filter validation using type-safe form utilities
function validateFilters(filters: EventFilterFormData): EventFilterFormData {
  // Use the centralized form validation
  const validationResult = validateFormData(filters, eventFilterFormFields)

  if (!validationResult.isValid) {
    // Log validation errors for debugging
    console.warn('Filter validation errors:', validationResult.errors)
  }

  const validated: EventFilterFormData = {}

  // Validate and sanitize eventDate
  const validDate = InputValidator.validateDate(filters.eventDate || null)
  if (validDate) {
    validated.eventDate = validDate
  }

  // Validate and sanitize genre slug
  const validGenre = InputValidator.validateSlug(filters.genre || null)
  if (validGenre) {
    validated.genre = validGenre
  }

  // Validate and sanitize venue slug
  const validVenue = InputValidator.validateSlug(filters.venue || null)
  if (validVenue) {
    validated.venue = validVenue
  }

  return validated
}

// Use enhanced HTML escaping from security utilities
const escapeHtml = InputValidator.sanitizeString;

// Generer bilde-URL med Sanity's automatiske hotspot-håndtering
const getImageUrl = (image: any, width: number, height: number) => {
  if (!image || !urlFor) return '';
  const imageBuilder = urlFor(image);
  return imageBuilder
    ? imageBuilder.width(width).height(height).url() || ''
    : '';
};

// Generer HTML for et enkelt arrangement
function generateEventHtml(event: Event): string {
  // Generer bilde-HTML hvis bilde finnes
  let imageHtml = '';
  if (event.image?.image) {
    const imageUrl = getImageUrl(event.image.image, 400, 300);
    const alt = event.image.alt || event.title;

    if (imageUrl) {
      imageHtml = `
        <div style="position: relative; height: 200px; overflow: hidden;">
          <img 
            src="${imageUrl}" 
            alt="${escapeHtml(alt)}" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 0;"
            loading="lazy"
          />
        </div>
      `;
    }
  }

  return `
    <div style="border: 1px solid #e9ecef; border-radius: 12px; background: white; overflow: hidden; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <a href="/program/${event.slug.current}" style="text-decoration: none; color: inherit; display: block;">
        ${imageHtml}
        <div style="padding: 1.25rem;">
          <h3 style="margin: 0 0 0.75rem 0; color: #333; font-size: 1.2rem; line-height: 1.3;">${escapeHtml(event.title)}</h3>
          <div style="color: #666; font-size: 0.9rem; line-height: 1.4;">
            ${
              event.eventDate
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 600; min-width: 3rem;">Dato:</span><span>${escapeHtml(event.eventDate.title)} (${escapeHtml(formatDateForLanguage(event.eventDate.date, 'no'))})</span></div>`
                : ''
            }
            ${
              event.eventTime
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 600; min-width: 3rem;">Tid:</span><span>${escapeHtml(event.eventTime.startTime)} - ${escapeHtml(event.eventTime.endTime)}</span></div>`
                : ''
            }
            ${
              event.venue
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 600; min-width: 3rem;">Sted:</span><span>${escapeHtml(event.venue.title)}</span></div>`
                : ''
            }
            ${
              event.artists && event.artists.length > 0
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 600; min-width: 4rem;">Artister:</span><span>${event.artists.map((artist) => escapeHtml(artist.name)).join(', ')}</span></div>`
                : ''
            }
            ${
              event.genre
                ? `<div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f0f0f0; display: flex; align-items: center; gap: 0.5rem;"><span style="font-weight: 600; min-width: 4rem;">Sjanger:</span><span style="color: #999; font-size: 0.85rem;">${escapeHtml(event.genre.title)}</span></div>`
                : ''
            }
          </div>
        </div>
      </a>
    </div>
  `;
}

// Rate limiter configuration
const rateLimiter = rateLimit({
  maxRequests: 30, // 30 requests per window
  windowMs: 60 * 1000, // 1 minute window
});

// OPTIONS handler for CORS preflight
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: {
      ...getCORSHeaders(origin),
      ...getSecurityHeaders(),
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimiter(request);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests', 
          resetTime: rateLimitResult.resetTime 
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...getSecurityHeaders(),
          },
        }
      );
    }

    // Validate Content-Type
    if (!validateContentType(request, 'application/x-www-form-urlencoded')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Content-Type' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getSecurityHeaders(),
          },
        }
      );
    }

    // Limit request body size (prevent DoS)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024) { // 1KB limit
      return new Response(
        JSON.stringify({ error: 'Request body too large' }), {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
            ...getSecurityHeaders(),
          },
        }
      );
    }

    // Parse and validate input data using type-safe form utilities
    const rawData = await request.text()
    const formData = new URLSearchParams(rawData)

    // Parse form data using centralized processor
    const parsedData = formDataProcessors.parseFormData(
      new FormData(Object.fromEntries(formData.entries()) as any)
    ) as EventFilterFormData

    // Enhanced filter validation with type safety
    const filters = validateFilters({
      eventDate: formData.get('eventDate') || undefined,
      genre: formData.get('genre') || undefined,
      venue: formData.get('venue') || undefined,
    })

    // Hent eventDates for å generere faner
    const eventDates = await sanityClient.fetch(
      `*[_type == "eventDate" && isActive == true] | order(date asc)`
    );

    // Bygg GROQ-spørring
    let query = `*[_type == "event" && isPublished == true`;
    let queryParams: any = {};

    if (filters.eventDate) {
      query += ` && eventDate->date == $eventDate`;
      queryParams.eventDate = filters.eventDate;
    }

    if (filters.genre) {
      query += ` && genre->slug.current == $genre`;
      queryParams.genre = filters.genre;
    }

    if (filters.venue) {
      query += ` && venue->slug.current == $venue`;
      queryParams.venue = filters.venue;
    }

    query += `] | order(eventDate->date asc) {
      _id,
      title,
      slug,
      eventTime{
        startTime,
        endTime
      },
      eventDate->{
        title,
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
      artists[]->{
        name,
        slug
      },
      image
    }`;
    const events: Event[] = await sanityClient.fetch(query, queryParams);

    // Generer HTML for arrangementene med antall resultater
    const resultsCountText = `Viser ${events.length} arrangement${events.length === 1 ? '' : 'er'}`;
    const noResultsTitle = 'Ingen arrangementer funnet';
    const noResultsText = 'Prøv å endre filtrene eller <a href="/program" style="color: #007acc;">vis alle arrangementer</a>';

    const resultsHtml = `
      <div id="event-results">
        ${
          events.length > 0
            ? `<div>
                <div style="margin-bottom: 1rem; padding: 0.5rem; background: #e8f5e8; border-radius: 4px; color: #2d5a2d;">
                  ${resultsCountText}
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                  ${events.map(event => generateEventHtml(event)).join('')}
                </div>
              </div>`
            : `<div style="text-align: center; padding: 3rem; color: #666;">
                <div style="font-size: 2rem; margin-bottom: 1rem; color: #666;">Ingen resultater</div>
                <h3 style="margin: 0 0 1rem 0; color: #333;">${noResultsTitle}</h3>
                <p style="margin: 0; font-size: 1.1rem;">
                  ${noResultsText}
                </p>
              </div>`
        }
      </div>
    `;

    // Bestem riktig URL basert på valgt filter
    let pushUrl = '/program';
    if (filters.eventDate) {
      pushUrl = `/program#tab-${filters.eventDate}`;
    } else {
      pushUrl = '/program#tab-all-days';
    }

    const origin = request.headers.get('origin');
    
    return new Response(resultsHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // Enhanced caching
        'HX-Push-Url': pushUrl, // HTMX vil oppdatere URL-en med denne
        ...getCORSHeaders(origin),
        ...getSecurityHeaders(),
      },
    });
  } catch (error) {
    // Enhanced error handling with logging (don't expose internal errors)
    console.error('Filter events API error:', error);
    
    const origin = request.headers.get('origin');
    
    return new Response(
      `<div style="text-align: center; padding: 2rem; color: #dc3545;">
        <div style="font-size: 2rem; margin-bottom: 1rem; color: #dc3545;">Feil</div>
        <h3 style="margin: 0 0 1rem 0;">Beklager, det oppstod en feil</h3>
        <p style="margin: 0; font-size: 1.1rem;">Prøv igjen senere eller kontakt support hvis problemet vedvarer.</p>
      </div>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...getCORSHeaders(origin),
          ...getSecurityHeaders(),
        },
      }
    );
  }
};