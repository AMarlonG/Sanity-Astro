export const prerender = false;
import type { APIRoute } from 'astro';
import { createDataService } from '../../lib/sanity/dataService.js';
import { formatDateWithWeekday } from '../../lib/utils/dates';
import { getOptimizedImageUrl, getResponsiveSrcSet, IMAGE_QUALITY, RESPONSIVE_WIDTHS } from '../../lib/imageHelpers';
import { stegaClean } from '@sanity/client/stega';
import {
  rateLimit,
  InputValidator,
  getCORSHeaders,
  getSecurityHeaders
} from '../../lib/security';

// Rate limiter configuration
const rateLimiter = rateLimit({
  maxRequests: 60, // 60 requests per minute (generous for date filtering)
  windowMs: 60 * 1000,
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

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimiter(request);
    if (!rateLimitResult.allowed) {
      return new Response(
        `<div class="no-results">
          <h3 class="no-results-title">For mange forespørsler</h3>
          <p class="no-results-text">Vennligst vent et øyeblikk før du prøver igjen</p>
        </div>`,
        {
          status: 429,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': '60',
            ...getSecurityHeaders(),
          },
        }
      );
    }

    // Get and validate date filter from URL
    const dateParam = url.searchParams.get('date');
    const dateFilter = dateParam ? InputValidator.validateDate(dateParam) : null;
    const language = url.searchParams.get('lang') || 'no';

    // Create data service
    const dataService = createDataService(request);

    // Clear cache in development
    if (import.meta.env.DEV) {
      dataService.clearCache();
    }

    // Get program page data
    const programPage = await dataService.getProgramPage();
    const events = (programPage?.selectedEvents || []).filter(event => event != null);

    // Group events by date (same logic as program.astro)
    const eventsByDate = events.reduce((acc, event) => {
      if (!event?.eventDate?.date) return acc;

      const dateKey = event.eventDate.date;
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: event.eventDate.date,
          displayTitle: event.eventDate.title || formatDateWithWeekday(event.eventDate.date, language as 'no' | 'en'),
          events: []
        };
      }
      acc[dateKey].events.push(event);
      return acc;
    }, {} as Record<string, { date: string; displayTitle: string; events: typeof events }>);

    // Sort dates chronologically and sort events within each date by time
    const sortedDates = Object.values(eventsByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(dateGroup => ({
        ...dateGroup,
        events: dateGroup.events.sort((a, b) => {
          const timeA = a.eventTime?.startTime || '';
          const timeB = b.eventTime?.startTime || '';
          return timeA.localeCompare(timeB);
        })
      }));

    // Filter dates if date parameter is present
    const filteredDates = dateFilter
      ? sortedDates.filter(d => d.date === dateFilter)
      : sortedDates;

    // Generate HTML using the same structure as program.astro
    let html = '';

    if (filteredDates.length > 0) {
      html = filteredDates.map(({ date, displayTitle, events: dateEvents }) => `
        <section class="content-section date-section" data-date="${date}">
          <h3 class="date-title">${stegaClean(displayTitle)}</h3>
          <div class="events-grid">
            ${dateEvents.map((event) => {
              const eventSlug = stegaClean(event.slug_no?.current || event.slug_en?.current);
              const eventTitle = stegaClean(event.title);
              const eventExcerpt = event.excerpt ? stegaClean(event.excerpt) : '';

              let imageHtml = '';
              if (event.image?.image) {
                const imageUrl = getOptimizedImageUrl(event.image.image, 400, 300, IMAGE_QUALITY.CARD);
                const srcSet = getResponsiveSrcSet(event.image.image, RESPONSIVE_WIDTHS.MEDIUM, IMAGE_QUALITY.CARD);
                const alt = event.image.alt || event.title;

                imageHtml = `
                  <figure class="event-image">
                    <picture>
                      <source
                        srcset="${srcSet}"
                        type="image/webp"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <img
                        src="${imageUrl}"
                        alt="${alt}"
                        loading="lazy"
                        decoding="async"
                        class="event-card-image"
                      />
                    </picture>
                  </figure>
                `;
              }

              let metaHtml = '<dl class="event-meta">';

              if (event.eventDate?.date) {
                const formattedDate = formatDateWithWeekday(event.eventDate.date, language as 'no' | 'en');
                const timeRange = event.eventTime
                  ? `, kl. ${stegaClean(event.eventTime.startTime)}–${stegaClean(event.eventTime.endTime)}`
                  : '';

                metaHtml += `
                  <dt class="visually-hidden">Dato og tid</dt>
                  <dd class="event-datetime">${formattedDate}${timeRange}</dd>
                `;
              }

              if (event.venue?.title) {
                metaHtml += `
                  <dt class="visually-hidden">Sted</dt>
                  <dd class="event-venue">${stegaClean(event.venue.title)}</dd>
                `;
              }

              metaHtml += '</dl>';

              const ticketType = stegaClean(event.ticketType);
              let ticketHtml = '';

              if (ticketType === 'info') {
                const ticketInfo = stegaClean(event.ticketInfoText) || 'Gratis';
                ticketHtml = `<p class="ticket-info">${ticketInfo}</p>`;
              } else if (event.ticketUrl) {
                const ticketUrl = stegaClean(event.ticketUrl);
                ticketHtml = `<a href="${ticketUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Kjøp billetter her</a>`;
              }

              return `
                <article class="event-card card" data-event-date="${event.eventDate?.date}">
                  <h4 class="event-title">
                    <a href="/program/${eventSlug}" class="event-title-link">
                      ${eventTitle}
                    </a>
                  </h4>
                  ${eventExcerpt ? `<p class="event-excerpt">${eventExcerpt}</p>` : ''}
                  ${imageHtml}
                  ${metaHtml}
                  ${ticketHtml}
                </article>
              `;
            }).join('')}
          </div>
        </section>
      `).join('');
    } else {
      html = `
        <section class="content-section">
          <div class="no-results">
            <h3 class="no-results-title">Ingen arrangementer funnet</h3>
            <p class="no-results-text">Ingen arrangementer er lagt til ennå</p>
          </div>
        </section>
      `;
    }

    // Determine the URL to push to browser history
    let pushUrl = language === 'no' ? '/program' : '/en/program';
    if (dateFilter) {
      pushUrl += `?date=${dateFilter}`;
    }

    const origin = request.headers.get('origin');

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        'HX-Push-Url': pushUrl,
        ...getCORSHeaders(origin),
        ...getSecurityHeaders(),
      },
    });
  } catch (error) {
    console.error('Filter program API error:', error);

    const origin = request.headers.get('origin');

    return new Response(
      `<section class="content-section">
        <div class="no-results">
          <h3 class="no-results-title">Det oppstod en feil</h3>
          <p class="no-results-text">Vennligst prøv igjen senere</p>
        </div>
      </section>`,
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
