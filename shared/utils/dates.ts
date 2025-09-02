// Shared date utilities

export type Language = 'no' | 'en';

export function formatDate(date: string | Date, locale = 'nb-NO'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format date for specific language
 */
export function formatDateForLanguage(date: string | Date, language: Language): string {
  const locale = language === 'en' ? 'en-US' : 'nb-NO';
  return formatDate(date, locale);
}

export function formatTime(time: string, locale = 'nb-NO'): string {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

export function getRelativeTime(date: string | Date, locale = 'nb-NO'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'i dag';
  if (diffInDays === 1) return 'i går';
  if (diffInDays < 7) return `${diffInDays} dager siden`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} uker siden`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} måneder siden`;
  
  return `${Math.floor(diffInDays / 365)} år siden`;
}

/**
 * Get relative time for specific language
 */
export function getRelativeTimeForLanguage(date: string | Date, language: Language): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (language === 'en') {
    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }
  
  // Norwegian (keep existing logic)
  if (diffInDays === 0) return 'i dag';
  if (diffInDays === 1) return 'i går';
  if (diffInDays < 7) return `${diffInDays} dager siden`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} uker siden`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} måneder siden`;
  return `${Math.floor(diffInDays / 365)} år siden`;
}