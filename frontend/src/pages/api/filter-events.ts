export const prerender = false;
import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';

interface FilterOptions {
  eventDate?: string;
}

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
  image?: any;
}

// Validering av filter-parametere
function validateFilters(filters: FilterOptions): FilterOptions {
  const validated: FilterOptions = {};

  // Valider eventDate (må være ISO-dato)
  if (filters.eventDate && /^\d{4}-\d{2}-\d{2}$/.test(filters.eventDate)) {
    validated.eventDate = filters.eventDate;
  }

  return validated;
}

// Sanitize HTML for sikkerhet
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Generer HTML for et arrangement
function generateEventHtml(event: Event): string {
  return `
    <li style="margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
      <a href="/program/${event.slug.current}" style="text-decoration: none; color: inherit;">
        <h2 style="margin: 0 0 0.5rem 0; color: #333;">${escapeHtml(event.title)}</h2>
        
        <div style="margin-bottom: 0.5rem; color: #666;">
          ${
            event.eventDate
              ? `
            <p style="margin: 0 0 0.25rem 0;">
              📅 ${escapeHtml(event.eventDate.title)} (${new Date(event.eventDate.date).toLocaleDateString('nb-NO')})
            </p>
          `
              : ''
          }
          
          ${
            event.eventTime
              ? `
            <p style="margin: 0 0 0.25rem 0;">
              🕐 ${escapeHtml(event.eventTime.startTime)} - ${escapeHtml(event.eventTime.endTime)}
            </p>
          `
              : ''
          }
          
          ${
            event.venue
              ? `
            <p style="margin: 0 0 0.25rem 0;">
              🏢 ${escapeHtml(event.venue.title)}
            </p>
          `
              : ''
          }
          
          ${
            event.artists && event.artists.length > 0
              ? `
            <p style="margin: 0 0 0.25rem 0;">
              🎵 ${event.artists.map((artist) => escapeHtml(artist.name)).join(', ')}
            </p>
          `
              : ''
          }
          
          ${
            event.genre
              ? `
            <p style="margin: 0; color: #999; font-size: 0.9rem;">
              🎼 ${escapeHtml(event.genre.title)}
            </p>
          `
              : ''
          }
        </div>
      </a>
    </li>
  `;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Hent rå data fra request
    const rawData = await request.text();
    const formData = new URLSearchParams(rawData);

    const filters = validateFilters({
      eventDate: formData.get('eventDate') || undefined,
    });

    // Bygg GROQ-spørring
    let query = `*[_type == "event" && isPublished == true`;
    let queryParams: any = {};

    if (filters.eventDate) {
      query += ` && eventDate->date == $eventDate`;
      queryParams.eventDate = filters.eventDate;
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

    // Generer HTML-resultater
    const resultsHtml = `
      <div id="event-results">
        ${
          events.length > 0
            ? `<ul style="list-style: none; padding: 0;">
              ${events.map(generateEventHtml).join('')}
            </ul>`
            : `<p>Ingen arrangementer funnet med de valgte filtrene.</p>`
        }
      </div>
    `;

    return new Response(resultsHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300', // Cache i 5 minutter
      },
    });
  } catch (error) {
    console.error('Filter error:', error);
    return new Response(
      `<p style="color: #dc3545; text-align: center;">Beklager, det oppstod en feil ved filtrering. Prøv igjen senere.</p>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
};
