// Language utilities for Norwegian/English bilingual support

export type Language = 'no' | 'en';

/**
 * Extract language from URL parameter
 * Default to Norwegian if no language specified or invalid language provided
 */
export function getCurrentLanguage(request: Request): Language {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');
  return lang === 'en' ? 'en' : 'no';
}

/**
 * Get localized content with fallback to Norwegian
 * This function handles any content type (string, arrays, objects)
 */
export function getLocalizedContent<T>(
  norwegian: T,
  english: T | undefined | null,
  language: Language
): T {
  if (language === 'en' && english !== undefined && english !== null) {
    // For strings, also check if it's not empty
    if (typeof english === 'string' && english.trim() === '') {
      return norwegian;
    }
    // For arrays, check if it's not empty
    if (Array.isArray(english) && english.length === 0) {
      return norwegian;
    }
    return english;
  }
  return norwegian;
}

/**
 * Get localized text with fallback to Norwegian
 * Specifically for string content with empty string checking
 */
export function getLocalizedText(
  norwegian: string,
  english: string | undefined | null,
  language: Language
): string {
  if (language === 'en' && english && english.trim() !== '') {
    return english;
  }
  return norwegian;
}

/**
 * Create URL with language parameter
 * If language is Norwegian, removes the lang parameter to keep URLs clean
 */
export function createLanguageUrl(currentUrl: string, targetLanguage: Language): string {
  const url = new URL(currentUrl);
  
  if (targetLanguage === 'en') {
    url.searchParams.set('lang', 'en');
  } else {
    url.searchParams.delete('lang');
  }
  
  return url.toString();
}

/**
 * Create language toggle URL (switches between no/en)
 */
export function createLanguageToggleUrl(currentUrl: string, currentLanguage: Language): string {
  const targetLanguage = currentLanguage === 'no' ? 'en' : 'no';
  return createLanguageUrl(currentUrl, targetLanguage);
}

/**
 * Get language display name for UI
 */
export function getLanguageDisplayName(language: Language): string {
  return language === 'en' ? 'English' : 'Norsk';
}

/**
 * Get language flag emoji for UI
 */
export function getLanguageFlag(language: Language): string {
  return language === 'en' ? '🇺🇸' : '🇳🇴';
}

/**
 * Check if current URL has language parameter
 */
export function hasLanguageParameter(url: string): boolean {
  const urlObj = new URL(url);
  return urlObj.searchParams.has('lang');
}