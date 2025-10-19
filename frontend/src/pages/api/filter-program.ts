export const prerender = false;
import type { APIRoute } from 'astro';
import { defineQuery } from 'groq';
import { sanityClient } from 'sanity:client';
import { formatDateWithWeekday } from '../../lib/utils/dates';
import { getOptimizedImageUrl } from '../../lib/imageHelpers';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { stegaClean } from '@sanity/client/stega';

interface EventResult {
  _id: string;
  title?: string;
  slug_no?: { current?: string };
  slug_en?: { current?: string };
  image?: {
    image?: SanityImageSource;
    alt?: string;
  };
  eventDate?: {
    date?: string;
    title?: string;
  };
  eventTime?: {
    startTime?: string;
    endTime?: string;
  };
  venue?: {
    title?: string;
  };
  ticketType?: string;
  ticketUrl?: string;
}

interface DateInfo {
  date: string;
  title?: string;
}

const PROGRAM_QUERY = defineQuery(`*[
  _type == "programPage"
][0]{
  selectedEvents[]->{
    _id,
    title,
    slug_no,
    slug_en,
    "image": {
      "image": image,
      "alt": coalesce(imageAlt_no, imageAlt_en, image.alt)
    },
    eventDate->{
      date,
      title_display_no,
      title_display_en,
      "title": coalesce(title_display_no, title_display_en)
    },
    eventTime,
    venue->{title},
    ticketType,
    ticketUrl
  }
}`);

function generateEventCard(event: EventResult): string {
  const slug = stegaClean(event.slug_no?.current || event.slug_en?.current || '');
  const title = stegaClean(event.title || '');
  const venue = stegaClean(event.venue?.title || '');
  const startTime = stegaClean(event.eventTime?.startTime || '');
  const endTime = stegaClean(event.eventTime?.endTime || '');
  const alt = event.image?.alt || title;

  let imageHtml = '';
  if (event.image?.image) {
    const imageUrl = getOptimizedImageUrl(event.image.image, 400, 300, 80);
    imageHtml = `
      <div class="event-image">
        <picture>
          <img
            src="${imageUrl}"
            alt="${alt}"
            loading="lazy"
            decoding="async"
            class="event-card-image"
          />
        </picture>
      </div>
    `;
  }

  let ticketHtml = '';
  if (event.ticketType === 'free') {
    ticketHtml = '<span class="ticket-info">Gratis</span>';
  } else if (event.ticketUrl) {
    ticketHtml = `<a href="${event.ticketUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Kjøp billetter</a>`;
  } else {
    ticketHtml = '<span class="ticket-info">Salget starter snart</span>';
  }

  return `
    <article class="event-card card" data-event-date="${event.eventDate?.date || ''}">
      <a href="/program/${slug}" class="event-card-link">
        <div class="event-header">
          <h4 class="event-title">${title}</h4>
          <div class="event-meta">
            <div class="event-detail">
              ${venue}${venue && startTime ? ', ' : ''}${startTime ? `${startTime} - ${endTime}` : ''}
            </div>
          </div>
        </div>
        ${imageHtml}
      </a>
      <div class="event-actions">
        ${ticketHtml}
      </div>
    </article>
  `;
}


export const GET: APIRoute = async ({ url }) => {
  try {
    const dateParam = url.searchParams.get('date') || '';
    const language = (url.searchParams.get('lang') || 'no') as 'no' | 'en';

    // Fetch program data from Sanity
    const programData = await sanityClient.fetch(PROGRAM_QUERY);
    const events = (programData?.selectedEvents || []).filter((e: EventResult | null) => e != null) as EventResult[];

    // Extract available dates
    const availableDates: DateInfo[] = events
      .filter(event => event.eventDate?.date)
      .map(event => ({
        date: event.eventDate!.date!,
        title: event.eventDate!.title
      }));

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
      if (!event?.eventDate?.date) return acc;
      const dateKey = event.eventDate.date;
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: event.eventDate.date,
          displayTitle: event.eventDate.title || formatDateWithWeekday(event.eventDate.date, language),
          events: []
        };
      }
      acc[dateKey].events.push(event);
      return acc;
    }, {} as Record<string, { date: string; displayTitle: string; events: EventResult[] }>);

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
    const filteredDates = dateParam
      ? sortedDates.filter(d => d.date === dateParam)
      : sortedDates;

    // Generate results HTML (must match program.astro structure exactly!)
    let resultsHtml = '';
    if (filteredDates.length > 0) {
      resultsHtml = filteredDates.map(({ date, displayTitle, events: dateEvents }) => `
        <section class="content-section date-section" data-date="${date}">
          <h3 class="date-title">${displayTitle}</h3>
          <div class="grid events-grid">
            ${dateEvents.map(event => generateEventCard(event)).join('')}
          </div>
        </section>
      `).join('');
    } else {
      resultsHtml = `
        <section class="content-section">
          <div class="no-results">
            <h3 class="no-results-title">Ingen arrangementer funnet</h3>
            <p class="no-results-text">Ingen arrangementer er lagt til ennå</p>
          </div>
        </section>
      `;
    }

    // Return only the filtered results HTML
    // Filter buttons are updated via server-side URL state in DateFilter.astro
    return new Response(resultsHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Filter program API error:', error);

    return new Response(
      `<div id="event-results">
        <section class="content-section">
          <div class="no-results">
            <h3 class="no-results-title">Feil</h3>
            <p class="no-results-text">Beklager, det oppstod en feil. Prøv igjen senere.</p>
          </div>
        </section>
      </div>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
};
