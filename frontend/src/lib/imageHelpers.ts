import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from 'sanity:client'

const { projectId, dataset } = sanityClient.config()

/**
 * Standardized image quality levels for consistent optimization
 */
export const IMAGE_QUALITY = {
  THUMBNAIL: 60,
  CARD: 75,
  HERO: 85,
  FULL: 90,
  LQIP: 20
} as const

/**
 * Common image widths for responsive srcsets
 */
export const RESPONSIVE_WIDTHS = {
  SMALL: [320, 640, 960],
  MEDIUM: [400, 800, 1200],
  LARGE: [600, 1200, 1800, 2400],
  HERO: [800, 1200, 1600, 2000]
} as const

/**
 * Get Sanity image builder instance
 */
export function getImageBuilder(source: SanityImageSource) {
  if (!projectId || !dataset) {
    return null
  }
  return imageUrlBuilder({ projectId, dataset }).image(source)
}

/**
 * Generate optimized image URL with Sanity CDN
 *
 * @param source - Sanity image source object
 * @param width - Target width in pixels
 * @param height - Target height in pixels (optional, maintains aspect ratio if omitted)
 * @param quality - Image quality (1-100), defaults to CARD quality (75)
 * @returns Optimized image URL or null if builder fails
 */
export function getOptimizedImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
  quality: number = IMAGE_QUALITY.CARD
): string | null {
  const builder = getImageBuilder(source)
  if (!builder) return null

  let url = builder

  if (width) url = url.width(width)
  if (height) url = url.height(height)

  return url
    .auto('format') // Automatically serve AVIF/WebP when supported
    .quality(quality)
    .url()
}

/**
 * Generate responsive srcset for multiple widths
 *
 * @param source - Sanity image source object
 * @param widths - Array of widths to generate
 * @param quality - Image quality (1-100)
 * @returns Srcset string for use in <source> or <img> elements
 */
export function getResponsiveSrcSet(
  source: SanityImageSource,
  widths: number[] = RESPONSIVE_WIDTHS.MEDIUM,
  quality: number = IMAGE_QUALITY.CARD
): string {
  const builder = getImageBuilder(source)
  if (!builder) return ''

  return widths
    .map(w => {
      const url = builder
        .width(w)
        .auto('format')
        .quality(quality)
        .url()
      return `${url} ${w}w`
    })
    .join(', ')
}

/**
 * Generate LQIP (Low Quality Image Placeholder) URL
 * Useful for blur-up effect during image loading
 *
 * @param source - Sanity image source object
 * @returns Small, low-quality image URL
 */
export function getLQIPUrl(source: SanityImageSource): string | null {
  const builder = getImageBuilder(source)
  if (!builder) return null

  return builder
    .width(20)
    .quality(IMAGE_QUALITY.LQIP)
    .blur(5)
    .format('jpg')
    .url()
}

/**
 * Generate complete picture element data with multiple formats
 * Returns data structure for building <picture> elements in components
 *
 * @param source - Sanity image source object
 * @param widths - Array of widths to generate
 * @param quality - Image quality (1-100)
 * @returns Object with srcsets for AVIF, WebP, and JPG
 */
export interface PictureData {
  avif: string
  webp: string
  jpg: string
  fallback: string
  lqip: string | null
}

export function getPictureData(
  source: SanityImageSource,
  widths: number[] = RESPONSIVE_WIDTHS.MEDIUM,
  quality: number = IMAGE_QUALITY.CARD
): PictureData | null {
  const builder = getImageBuilder(source)
  if (!builder) return null

  const createSrcSet = (format: string) => {
    return widths
      .map(w => {
        const url = builder.width(w).format(format).quality(quality).url()
        return `${url} ${w}w`
      })
      .join(', ')
  }

  return {
    avif: createSrcSet('avif'),
    webp: createSrcSet('webp'),
    jpg: createSrcSet('jpg'),
    fallback: builder.width(widths[1] || 800).format('jpg').quality(quality).url(),
    lqip: getLQIPUrl(source)
  }
}

/**
 * Extract image metadata from Sanity image object
 * Useful for getting dimensions, LQIP, etc. from the query response
 */
export interface ImageMetadata {
  width?: number
  height?: number
  aspectRatio?: number
  lqip?: string
  dominantColor?: string
}

export function extractImageMetadata(imageObject: any): ImageMetadata {
  const metadata: ImageMetadata = {}

  if (imageObject?.asset?.metadata) {
    const { dimensions, lqip, palette } = imageObject.asset.metadata

    if (dimensions) {
      metadata.width = dimensions.width
      metadata.height = dimensions.height
      metadata.aspectRatio = dimensions.aspectRatio
    }

    if (lqip) {
      metadata.lqip = lqip
    }

    if (palette?.dominant?.background) {
      metadata.dominantColor = palette.dominant.background
    }
  }

  return metadata
}

/**
 * Calculate sizes attribute for responsive images
 * Generates the sizes attribute based on breakpoints
 *
 * @param maxWidth - Maximum width of image container (e.g., "800px")
 * @returns Sizes attribute string
 */
export function calculateSizes(maxWidth: string = '100vw'): string {
  return `(max-width: 768px) 100vw, ${maxWidth}`
}

/**
 * Get optimized image for card/thumbnail use
 * Convenience function with preset quality and size
 */
export function getCardImageUrl(
  source: SanityImageSource,
  width: number = 400,
  height?: number
): string | null {
  return getOptimizedImageUrl(source, width, height, IMAGE_QUALITY.CARD)
}

/**
 * Get optimized image for hero/featured use
 * Convenience function with higher quality
 */
export function getHeroImageUrl(
  source: SanityImageSource,
  width: number = 1200,
  height?: number
): string | null {
  return getOptimizedImageUrl(source, width, height, IMAGE_QUALITY.HERO)
}
