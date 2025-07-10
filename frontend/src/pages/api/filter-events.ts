export const prerender = false;
import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface FilterOptions {
  eventDate?: string;
  genre?: string;
  venue?: string;
}

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

// Validering av filter-parametere
function validateFilters(filters: FilterOptions): FilterOptions {
  const validated: FilterOptions = {};
  // Valider eventDate (må være ISO-dato)
  if (filters.eventDate && /^\d{4}-\d{2}-\d{2}$/.test(filters.eventDate)) {
    validated.eventDate = filters.eventDate;
  }
  // Valider genre (må være en slug)
  if (filters.genre && /^[a-z0-9-]+$/.test(filters.genre)) {
    validated.genre = filters.genre;
  }
  // Valider venue (må være en slug)
  if (filters.venue && /^[a-z0-9-]+$/.test(filters.venue)) {
    validated.venue = filters.venue;
  }
  return validated;
}

// Escape HTML for sikkerhet
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Hjelpefunksjon for å formatere dato
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dayNames = [
    'Søndag',
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lørdag',
  ];
  const monthNames = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  return `${dayName}, ${day}. ${month}`;
}

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
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1rem;">📅</span><span>${escapeHtml(event.eventDate.title)} (${new Date(event.eventDate.date).toLocaleDateString('nb-NO')})</span></div>`
                : ''
            }
            ${
              event.eventTime
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1rem;">🕐</span><span>${escapeHtml(event.eventTime.startTime)} - ${escapeHtml(event.eventTime.endTime)}</span></div>`
                : ''
            }
            ${
              event.venue
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1rem;">🏢</span><span>${escapeHtml(event.venue.title)}</span></div>`
                : ''
            }
            ${
              event.artists && event.artists.length > 0
                ? `<div style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1rem;">🎵</span><span>${event.artists.map((artist) => escapeHtml(artist.name)).join(', ')}</span></div>`
                : ''
            }
            ${
              event.genre
                ? `<div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #f0f0f0; display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1rem;">🎼</span><span style="color: #999; font-size: 0.85rem;">${escapeHtml(event.genre.title)}</span></div>`
                : ''
            }
          </div>
        </div>
      </a>
    </div>
  `;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Hent rå data fra request
    const rawData = await request.text();
    // Parse form-data manuelt
    const formData = new URLSearchParams(rawData);
    // Hent og valider filtre
    const filters = validateFilters({
      eventDate: formData.get('eventDate') || undefined,
      genre: formData.get('genre') || undefined,
      venue: formData.get('venue') || undefined,
    });

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
    const resultsHtml = `
      <div id="event-results">
        ${
          events.length > 0
            ? `<div>
                <div style="margin-bottom: 1rem; padding: 0.5rem; background: #e8f5e8; border-radius: 4px; color: #2d5a2d;">
                  📊 Viser ${events.length} arrangement${events.length === 1 ? '' : 'er'}
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                  ${events.map(generateEventHtml).join('')}
                </div>
              </div>`
            : `<div style="text-align: center; padding: 3rem; color: #666;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="margin: 0 0 1rem 0; color: #333;">Ingen arrangementer funnet</h3>
                <p style="margin: 0; font-size: 1.1rem;">
                  Prøv å endre filtrene eller <a href="/program" style="color: #007acc;">vis alle arrangementer</a>
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

    return new Response(resultsHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300', // Cache i 5 minutter
        'HX-Push-Url': pushUrl, // HTMX vil oppdatere URL-en med denne
      },
    });
  } catch (error) {
    // Feilhåndtering: vis en tydelig feilmelding til bruker
    return new Response(
      `<div style="text-align: center; padding: 2rem; color: #dc3545;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h3 style="margin: 0 0 1rem 0;">Beklager, det oppstod en feil</h3>
        <p style="margin: 0; font-size: 1.1rem;">Prøv igjen senere eller kontakt support hvis problemet vedvarer.</p>
      </div>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
};
