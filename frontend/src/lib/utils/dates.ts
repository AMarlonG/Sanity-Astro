/**
 * Format date for specific language
 */
export function formatDateForLanguage(date: string | Date, language: 'no' | 'en' = 'no'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const locale = language === 'en' ? 'en-US' : 'nb-NO';

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date with full weekday for filter display
 * Norwegian: "Tirsdag 23. juni"
 * English: "Tuesday 23 June"
 */
export function formatDateWithWeekday(date: string | Date, language: 'no' | 'en' = 'no'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'en' ? 'en-US' : 'nb-NO';

  const formatted = dateObj.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Capitalize first letter (for Norwegian locale which may return lowercase)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
