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
