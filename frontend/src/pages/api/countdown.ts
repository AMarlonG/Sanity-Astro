import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';

export const GET: APIRoute = async ({ url }) => {
  const eventId = url.searchParams.get('eventId');
  
  if (!eventId) {
    return new Response('Event ID required', { status: 400 });
  }
  
  // Fetch event data
  const event = await sanityClient.fetch(
    `*[_type == "event" && _id == $eventId][0]{
      title,
      eventDate,
      eventTime
    }`,
    { eventId }
  );
  
  if (!event) {
    return new Response('Event not found', { status: 404 });
  }
  
  // Calculate time remaining
  const eventDate = new Date(event.eventDate.date);
  // Clean eventTime of any Unicode characters
  const cleanTime = event.eventTime.startTime.replace(/[^\d:]/g, '').trim();
  const timeParts = cleanTime.split(':');
  const hours = parseInt(timeParts[0] || '0', 10);
  const minutes = parseInt(timeParts[1] || '0', 10);
  eventDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    // Event has started
    const html = `
      <div class="countdown__display">
        <p class="countdown__expired">Arrangementet har startet!</p>
      </div>
    `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Calculate days, hours, minutes
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  // Build HTML response as sentence
  let sentence = '';
  
  if (days > 0) {
    sentence += `${days} ${days === 1 ? 'dag' : 'dager'}, `;
  }
  
  if (hoursRemaining > 0 || days > 0) {
    sentence += `${hoursRemaining} ${hoursRemaining === 1 ? 'time' : 'timer'} og `;
  }
  
  sentence += `${minutesRemaining} ${minutesRemaining === 1 ? 'minutt' : 'minutter'}`;
  
  const html = `
    <div class="countdown__display">
      <p class="countdown__sentence">
        <span class="countdown__title-inline">Festivalen starter om </span>${sentence}
      </p>
    </div>
  `;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
};