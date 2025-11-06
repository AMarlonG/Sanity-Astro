/**
 * Unified Image Utilities for Sanity + Astro
 *
 * Production-ready image optimization with:
 * - Modern TypeScript interfaces
 * - SSR-compatible (no browser APIs)
 * - BlurHash and LQIP support
 * - Responsive srcset generation
 * - Hotspot and crop preservation
 * - Multi-format picture element support
 */

import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from 'sanity:client'
import { decode } from 'blurhash'

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
 * Image URL generation options
 */
export interface ImageUrlOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png'
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  blur?: number
}

/**
 * Image metadata extracted from Sanity
 */
export interface ImageMetadata {
  width?: number
  height?: number
  aspectRatio?: number
  lqip?: string
  blurHash?: string
  dominantColor?: string
  palette?: {
    darkMuted?: { background: string; foreground: string; population: number }
    darkVibrant?: { background: string; foreground: string; population: number }
    dominant?: { background: string; foreground: string; population: number }
    lightMuted?: { background: string; foreground: string; population: number }
    lightVibrant?: { background: string; foreground: string; population: number }
    muted?: { background: string; foreground: string; population: number }
    vibrant?: { background: string; foreground: string; population: number }
  }
  hotspot?: {
    x: number
    y: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

/**
 * Picture element data structure
 */
export interface PictureData {
  avif: string
  webp: string
  jpg: string
  fallback: string
  lqip: string | null
}

/**
 * Responsive image source for picture elements
 */
export interface ResponsiveImageSource {
  format: string
  srcset: string
}

/**
 * Get Sanity image builder instance
 *
 * @param source - Sanity image source object
 * @returns Image URL builder or null if configuration is missing
 */
export function getImageBuilder(source: SanityImageSource) {
  const { projectId, dataset } = sanityClient.config()

  if (!projectId || !dataset) {
    console.warn('Sanity project ID or dataset not configured')
    return null
  }

  return imageUrlBuilder({ projectId, dataset }).image(source)
}

/**
 * Generate optimized image URL with Sanity CDN
 *
 * Automatically serves AVIF/WebP when supported by the browser.
 * Preserves hotspot and crop data from Sanity.
 *
 * @param source - Sanity image source object
 * @param width - Target width in pixels
 * @param height - Target height in pixels (optional, maintains aspect ratio if omitted)
 * @param quality - Image quality (1-100), defaults to CARD quality (75)
 * @returns Optimized image URL or null if builder fails
 *
 * @example
 * ```typescript
 * const url = getOptimizedImageUrl(image, 800, undefined, IMAGE_QUALITY.HERO)
 * ```
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
 * Creates a srcset string with multiple image variants at different widths.
 * Use with the `sizes` attribute for optimal responsive images.
 *
 * @param source - Sanity image source object
 * @param widths - Array of widths to generate
 * @param quality - Image quality (1-100)
 * @returns Srcset string for use in `<source>` or `<img>` elements
 *
 * @example
 * ```typescript
 * const srcset = getResponsiveSrcSet(image, RESPONSIVE_WIDTHS.MEDIUM)
 * // Returns: "https://cdn.sanity.io/...?w=400 400w, https://cdn.sanity.io/...?w=800 800w, ..."
 * ```
 */
export function getResponsiveSrcSet(
  source: SanityImageSource,
  widths: readonly number[] = RESPONSIVE_WIDTHS.MEDIUM,
  quality: number = IMAGE_QUALITY.CARD
): string {
  const builder = getImageBuilder(source)
  if (!builder) return ''

  return widths
    .map(width => {
      const url = builder
        .width(width)
        .auto('format')
        .quality(quality)
        .url()
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Generate LQIP (Low Quality Image Placeholder) URL
 *
 * Creates a tiny, blurred image for blur-up loading effect.
 * Use as placeholder while full image loads.
 *
 * @param source - Sanity image source object
 * @returns Small, low-quality image URL
 *
 * @example
 * ```typescript
 * const placeholder = getLQIPUrl(image)
 * // Use in background-image while loading full image
 * ```
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
 * Decode BlurHash to base64 data URI
 *
 * Converts a BlurHash string into a base64-encoded image for use as a placeholder.
 * BlurHash provides better visual quality than LQIP for placeholders.
 *
 * @param blurHash - BlurHash string from Sanity metadata
 * @param width - Decoded image width (default: 32px)
 * @param height - Decoded image height (default: 32px)
 * @returns Base64 data URI for use in img src or CSS background
 *
 * @example
 * ```typescript
 * const placeholder = getBlurHashPlaceholder(metadata.blurHash)
 * // Returns: "data:image/png;base64,iVBORw0KGgo..."
 * ```
 */
export function getBlurHashPlaceholder(
  blurHash: string,
  width: number = 32,
  height: number = 32
): string | null {
  if (!blurHash) return null

  try {
    const pixels = decode(blurHash, width, height)

    // Create canvas in memory (works in Node.js with canvas polyfill if needed)
    if (typeof window === 'undefined') {
      // SSR: Return a simple placeholder or the blurhash string
      // Client-side hydration can replace this with actual decoded image
      return null
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.warn('Failed to decode BlurHash:', error)
    return null
  }
}

/**
 * Generate complete picture element data with multiple formats
 *
 * Returns srcsets for AVIF, WebP, and JPG formats for maximum browser compatibility.
 * Use with `<picture>` element for optimal format delivery.
 *
 * @param source - Sanity image source object
 * @param widths - Array of widths to generate
 * @param quality - Image quality (1-100)
 * @returns Object with srcsets for AVIF, WebP, JPG, and fallback URL
 *
 * @example
 * ```astro
 * const pictureData = getPictureData(image, RESPONSIVE_WIDTHS.HERO)
 *
 * <picture>
 *   <source srcset={pictureData.avif} type="image/avif" />
 *   <source srcset={pictureData.webp} type="image/webp" />
 *   <source srcset={pictureData.jpg} type="image/jpeg" />
 *   <img src={pictureData.fallback} alt="..." />
 * </picture>
 * ```
 */
export function getPictureData(
  source: SanityImageSource,
  widths: readonly number[] = RESPONSIVE_WIDTHS.MEDIUM,
  quality: number = IMAGE_QUALITY.CARD
): PictureData | null {
  const builder = getImageBuilder(source)
  if (!builder) return null

  const createSrcSet = (format: string) => {
    return widths
      .map(width => {
        const url = builder
          .width(width)
          .format(format as any)
          .quality(quality)
          .url()
        return `${url} ${width}w`
      })
      .join(', ')
  }

  return {
    avif: createSrcSet('avif'),
    webp: createSrcSet('webp'),
    jpg: createSrcSet('jpg'),
    fallback: builder
      .width(widths[1] || 800)
      .format('jpg')
      .quality(quality)
      .url(),
    lqip: getLQIPUrl(source)
  }
}

/**
 * Generate responsive image set with multiple formats and sizes
 *
 * Alternative to getPictureData with more flexibility over formats and quality.
 *
 * @param source - Sanity image source object
 * @param widths - Array of widths to generate
 * @param formats - Array of formats to generate (e.g., ['avif', 'webp', 'jpg'])
 * @param aspectRatio - Optional aspect ratio to maintain
 * @param quality - Base image quality (adjusted per format)
 * @returns Array of responsive image sources
 */
export function getResponsiveImageSet(
  source: SanityImageSource,
  widths: number[] = [400, 800, 1200],
  formats: string[] = ['avif', 'webp', 'jpg'],
  aspectRatio?: number,
  quality: number = IMAGE_QUALITY.CARD
): ResponsiveImageSource[] {
  const builder = getImageBuilder(source)
  if (!builder) return []

  return formats.map(format => {
    const srcset = widths
      .map(width => {
        const height = aspectRatio ? Math.round(width / aspectRatio) : undefined

        let urlBuilder = builder.width(width)
        if (height) urlBuilder = urlBuilder.height(height)

        // Adjust quality per format (AVIF compresses better)
        const formatQuality =
          format === 'avif' ? Math.round(quality * 0.7) :
          format === 'webp' ? Math.round(quality * 0.9) :
          quality

        const url = urlBuilder
          .format(format as any)
          .quality(formatQuality)
          .fit('crop')
          .url()

        return `${url} ${width}w`
      })
      .join(', ')

    return { format, srcset }
  })
}

/**
 * Extract image metadata from Sanity image object
 *
 * Pulls dimensions, LQIP, BlurHash, color palette, hotspot, and crop data.
 * Use this to get all available metadata for advanced image handling.
 *
 * @param imageObject - Sanity image object from query (includes asset.metadata)
 * @returns Complete image metadata
 *
 * @example
 * ```typescript
 * // In your GROQ query:
 * // image {
 * //   asset-> {
 * //     metadata { dimensions, lqip, blurHash, palette }
 * //   },
 * //   hotspot,
 * //   crop
 * // }
 *
 * const metadata = extractImageMetadata(imageObject)
 * console.log(metadata.blurHash, metadata.dominantColor, metadata.aspectRatio)
 * ```
 */
export function extractImageMetadata(imageObject: any): ImageMetadata {
  const metadata: ImageMetadata = {}

  if (imageObject?.asset?.metadata) {
    const assetMetadata = imageObject.asset.metadata

    // Dimensions and aspect ratio
    if (assetMetadata.dimensions) {
      metadata.width = assetMetadata.dimensions.width
      metadata.height = assetMetadata.dimensions.height
      metadata.aspectRatio = assetMetadata.dimensions.aspectRatio
    }

    // LQIP (base64 encoded thumbnail)
    if (assetMetadata.lqip) {
      metadata.lqip = assetMetadata.lqip
    }

    // BlurHash (compact image placeholder)
    if (assetMetadata.blurHash) {
      metadata.blurHash = assetMetadata.blurHash
    }

    // Color palette (extracted by Sanity)
    if (assetMetadata.palette) {
      metadata.palette = assetMetadata.palette

      // Convenience: dominant color
      if (assetMetadata.palette.dominant?.background) {
        metadata.dominantColor = assetMetadata.palette.dominant.background
      }
    }
  }

  // Hotspot (focal point for cropping)
  if (imageObject?.hotspot) {
    metadata.hotspot = {
      x: imageObject.hotspot.x,
      y: imageObject.hotspot.y
    }
  }

  // Crop (user-defined crop area)
  if (imageObject?.crop) {
    metadata.crop = {
      top: imageObject.crop.top,
      bottom: imageObject.crop.bottom,
      left: imageObject.crop.left,
      right: imageObject.crop.right
    }
  }

  return metadata
}

/**
 * Calculate sizes attribute for responsive images
 *
 * Generates the `sizes` attribute based on viewport breakpoints.
 * Tells the browser which image size to load at different screen widths.
 *
 * @param maxWidth - Maximum width of image container (e.g., "800px", "50vw")
 * @returns Sizes attribute string
 *
 * @example
 * ```typescript
 * const sizes = calculateSizes("800px")
 * // Returns: "(max-width: 768px) 100vw, 800px"
 *
 * <img srcset="..." sizes={sizes} />
 * ```
 */
export function calculateSizes(maxWidth: string = '100vw'): string {
  return `(max-width: 768px) 100vw, ${maxWidth}`
}

/**
 * Generate advanced sizes attribute with custom breakpoints
 *
 * For more complex layouts with multiple breakpoints.
 *
 * @param breakpoints - Array of breakpoint configurations
 * @returns Generated sizes attribute string
 *
 * @example
 * ```typescript
 * const sizes = generateSizesAttribute([
 *   { maxWidth: 640, size: '100vw' },
 *   { maxWidth: 1024, size: '50vw' },
 *   { size: '800px' }
 * ])
 * // Returns: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
 * ```
 */
export function generateSizesAttribute(
  breakpoints: Array<{ minWidth?: number; maxWidth?: number; size: string }>
): string {
  return breakpoints
    .map(breakpoint => {
      if (breakpoint.minWidth && breakpoint.maxWidth) {
        return `(min-width: ${breakpoint.minWidth}px) and (max-width: ${breakpoint.maxWidth}px) ${breakpoint.size}`
      } else if (breakpoint.minWidth) {
        return `(min-width: ${breakpoint.minWidth}px) ${breakpoint.size}`
      } else if (breakpoint.maxWidth) {
        return `(max-width: ${breakpoint.maxWidth}px) ${breakpoint.size}`
      }
      return breakpoint.size
    })
    .join(', ')
}

/**
 * Get optimized image for card/thumbnail use
 *
 * Convenience function with preset quality and size for card components.
 *
 * @param source - Sanity image source object
 * @param width - Card width (default: 400px)
 * @param height - Card height (optional, maintains aspect ratio if omitted)
 * @returns Optimized card image URL
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
 *
 * Convenience function with higher quality for hero sections.
 *
 * @param source - Sanity image source object
 * @param width - Hero width (default: 1200px)
 * @param height - Hero height (optional, maintains aspect ratio if omitted)
 * @returns Optimized hero image URL
 */
export function getHeroImageUrl(
  source: SanityImageSource,
  width: number = 1200,
  height?: number
): string | null {
  return getOptimizedImageUrl(source, width, height, IMAGE_QUALITY.HERO)
}
