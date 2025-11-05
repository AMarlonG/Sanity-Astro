export type Language = 'no' | 'en';

/**
 * Format date with standard format (no weekday)
 * Norwegian: "23. juni 2024"
 * English: "June 23, 2024"
 */
function formatDate(date: string | Date, locale = 'nb-NO'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format date for specific language (standard format)
 */
export function formatDateForLanguage(date: string | Date, language: Language): string {
  const locale = language === 'en' ? 'en-US' : 'nb-NO';
  return formatDate(date, locale);
}

/**
 * Format date with full weekday for filter display
 * Norwegian: "Tirsdag 23. juni"
 * English: "Tuesday 30 December"
 */
export function formatDateWithWeekday(date: string | Date, language: 'no' | 'en' = 'no'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (language === 'en') {
    // English format: "Tuesday 30 December"
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
    return `${weekday} ${day} ${month}`;
  }

  // Norwegian format: "Tirsdag 23. juni"
  const formatted = dateObj.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Capitalize first letter (for Norwegian locale which may return lowercase)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
