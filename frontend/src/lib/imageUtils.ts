/**
 * Enhanced Image Utilities for Sanity + Astro 5 with Modern Optimization
 * Supports hotspot, modern formats, responsive images, and performance optimization
 */

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "sanity:client";

export interface ImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  auto?: 'format';
  dpr?: number;
  blur?: number;
}

export interface ResponsiveImageSource {
  format: string;
  srcset: string;
}

export interface ImageMetadata {
  width?: number;
  height?: number;
  aspectRatio?: number;
  lqip?: string;
  blurHash?: string;
  dominantColor?: string;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Create optimized image URL with full Sanity feature support
 */
export function createOptimizedImageUrl(
  source: SanityImageSource,
  options: ImageUrlOptions = {}
): string | null {
  if (!source) return null;
  
  const { projectId, dataset } = sanityClient.config();
  if (!projectId || !dataset) return null;
  
  const builder = imageUrlBuilder({ projectId, dataset });
  let urlBuilder = builder.image(source);
  
  // Apply transformations while preserving hotspot/crop
  if (options.width) urlBuilder = urlBuilder.width(options.width);
  if (options.height) urlBuilder = urlBuilder.height(options.height);
  if (options.quality) urlBuilder = urlBuilder.quality(options.quality);
  if (options.format && options.format !== 'auto') {
    // Type assertion needed as Sanity's ImageFormat type may not include all formats
    urlBuilder = urlBuilder.format(options.format as any);
  }
  if (options.fit) urlBuilder = urlBuilder.fit(options.fit);
  if (options.dpr) urlBuilder = urlBuilder.dpr(options.dpr);
  if (options.blur) urlBuilder = urlBuilder.blur(options.blur);
  
  // Auto-format and compression for modern browsers
  if (options.auto) urlBuilder = urlBuilder.auto(options.auto);
  
  return urlBuilder.url();
}

/**
 * Generate responsive image set with multiple formats and sizes
 */
export function createResponsiveImageSet(
  source: SanityImageSource,
  widths: number[] = [400, 600, 800, 1200, 1600],
  formats: string[] = ['avif', 'webp', 'jpg'],
  aspectRatio?: number,
  quality: number = 80
): ResponsiveImageSource[] {
  if (!source) return [];
  
  return formats.map((format) => {
    const parts = widths.map((width) => {
      const height = aspectRatio ? Math.round(width / aspectRatio) : undefined;
      const url = createOptimizedImageUrl(source, {
        width,
        height,
        format: format as any,
        quality: format === 'avif' ? 50 : format === 'webp' ? 75 : quality,
        auto: 'format',
        fit: 'crop'
      });

      return url ? `${url} ${width}w` : null;
    }).filter((part): part is string => Boolean(part));

    return {
      format,
      srcset: parts.join(', ')
    };
  });
}

/**
 * Generate LQIP (Low Quality Image Placeholder) for better perceived performance
 */
export function createLQIP(
  source: SanityImageSource,
  width: number = 20,
  quality: number = 20
): string | null {
  return createOptimizedImageUrl(source, {
    width,
    quality,
    format: 'jpg',
    blur: 5
  });
}

/**
 * Extract image metadata from Sanity image object
 */
export function extractImageMetadata(imageObject: any): ImageMetadata {
  const metadata: ImageMetadata = {};
  
  if (imageObject?.asset?.metadata) {
    const assetMetadata = imageObject.asset.metadata;
    
    if (assetMetadata.dimensions) {
      metadata.width = assetMetadata.dimensions.width;
      metadata.height = assetMetadata.dimensions.height;
      metadata.aspectRatio = assetMetadata.dimensions.aspectRatio;
    }
    
    if (assetMetadata.lqip) {
      metadata.lqip = assetMetadata.lqip;
    }
    
    if (assetMetadata.blurHash) {
      metadata.blurHash = assetMetadata.blurHash;
    }
    
    if (assetMetadata.palette?.dominant?.background) {
      metadata.dominantColor = assetMetadata.palette.dominant.background;
    }
  }
  
  if (imageObject?.hotspot) {
    metadata.hotspot = {
      x: imageObject.hotspot.x,
      y: imageObject.hotspot.y
    };
  }
  
  if (imageObject?.crop) {
    metadata.crop = {
      top: imageObject.crop.top,
      bottom: imageObject.crop.bottom,
      left: imageObject.crop.left,
      right: imageObject.crop.right
    };
  }
  
  return metadata;
}

/**
 * Calculate optimal image dimensions based on container size and device pixel ratio
 */
export function calculateOptimalDimensions(
  containerWidth: number,
  containerHeight?: number,
  aspectRatio?: number,
  dpr: number = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
): { width: number; height?: number } {
  const width = Math.round(containerWidth * dpr);
  const height = containerHeight ? Math.round(containerHeight * dpr) : 
                 aspectRatio ? Math.round(width / aspectRatio) : undefined;
  
  return { width, height };
}

/**
 * Detect browser support for modern image formats
 */
export function detectFormatSupport(): Promise<{
  avif: boolean;
  webp: boolean;
  jpg: boolean;
}> {
  if (typeof window === 'undefined') {
    return Promise.resolve({ avif: false, webp: false, jpg: true });
  }

  const testAvif = new Promise<boolean>((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => resolve(avif.height === 2);
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });

  const testWebp = new Promise<boolean>((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => resolve(webp.height === 2);
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  return Promise.all([testAvif, testWebp]).then(([avif, webp]) => ({
    avif,
    webp,
    jpg: true
  }));
}

/**
 * Get optimal format based on browser support
 */
export async function getOptimalFormat(): Promise<'avif' | 'webp' | 'jpg'> {
  const support = await detectFormatSupport();
  
  if (support.avif) return 'avif';
  if (support.webp) return 'webp';
  return 'jpg';
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizesAttribute(
  breakpoints: Array<{ minWidth?: number; maxWidth?: number; size: string }>
): string {
  return breakpoints
    .map(bp => {
      if (bp.minWidth && bp.maxWidth) {
        return `(min-width: ${bp.minWidth}px) and (max-width: ${bp.maxWidth}px) ${bp.size}`;
      } else if (bp.minWidth) {
        return `(min-width: ${bp.minWidth}px) ${bp.size}`;
      } else if (bp.maxWidth) {
        return `(max-width: ${bp.maxWidth}px) ${bp.size}`;
      }
      return bp.size;
    })
    .join(', ');
}

/**
 * Optimize image loading based on viewport and connection
 */
export function shouldEagerLoad(
  element: HTMLElement,
  threshold: number = 1.5
): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Load eagerly if image is above the fold or close to it
  return rect.top < windowHeight * threshold;
}

/**
 * Image performance monitoring utilities
 */
export class ImagePerformanceMonitor {
  private static metrics: Map<string, {
    loadTime: number;
    fileSize?: number;
    format: string;
    fromCache: boolean;
  }> = new Map();

  static startTiming(imageUrl: string): number {
    return performance.now();
  }

  static endTiming(
    imageUrl: string, 
    startTime: number, 
    format: string,
    fromCache: boolean = false
  ): void {
    const loadTime = performance.now() - startTime;
    
    this.metrics.set(imageUrl, {
      loadTime,
      format,
      fromCache
    });
  }

  static getMetrics(): typeof ImagePerformanceMonitor.metrics {
    return this.metrics;
  }

  static getAverageLoadTime(): number {
    const times = Array.from(this.metrics.values()).map(m => m.loadTime);
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
}
