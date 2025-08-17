import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createOptimizedImageUrl,
  createResponsiveImageSet,
  createLQIP,
  extractImageMetadata,
  calculateOptimalDimensions,
  generateSizesAttribute,
  ImagePerformanceMonitor
} from './imageUtils'

// Mock Sanity client
vi.mock('sanity:client', () => ({
  sanityClient: {
    config: () => ({
      projectId: 'test-project',
      dataset: 'test-dataset'
    })
  }
}))

describe('Image Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createOptimizedImageUrl', () => {
    it('creates optimized URL with basic options', () => {
      const mockImage = { 
        asset: { 
          _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
          _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
        }
      }
      
      const url = createOptimizedImageUrl(mockImage, {
        width: 800,
        height: 600,
        quality: 80,
        format: 'webp'
      })
      
      expect(url).toContain('test-project')
      expect(url).toContain('test-dataset')
      expect(url).toContain('w=800')
      expect(url).toContain('h=600')
      expect(url).toContain('q=80')
      expect(url).toContain('fm=webp')
    })

    it('handles missing image gracefully', () => {
      const url = createOptimizedImageUrl(null)
      expect(url).toBeNull()
    })

    it('applies auto format and fit', () => {
      const mockImage = { 
        asset: { 
          _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
          _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
        }
      }
      
      const url = createOptimizedImageUrl(mockImage, {
        width: 400,
        auto: 'format',
        fit: 'crop'
      })
      
      expect(url).toContain('auto=format')
      expect(url).toContain('fit=crop')
    })
  })

  describe('createResponsiveImageSet', () => {
    it('creates responsive image sets for multiple formats', () => {
      const mockImage = { 
        asset: { 
          _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
          _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
        }
      }
      const widths = [400, 800, 1200]
      const formats = ['avif', 'webp', 'jpg']
      
      const imageSets = createResponsiveImageSet(mockImage, widths, formats, 16/9, 80)
      
      expect(imageSets).toHaveLength(3) // 3 formats
      expect(imageSets[0].format).toBe('avif')
      expect(imageSets[1].format).toBe('webp')
      expect(imageSets[2].format).toBe('jpg')
      
      // Check each format has all width variants
      imageSets.forEach(set => {
        expect(set.sources).toHaveLength(3) // 3 widths
        expect(set.sources[0].width).toBe(400)
        expect(set.sources[1].width).toBe(800)
        expect(set.sources[2].width).toBe(1200)
      })
    })

    it('handles empty image gracefully', () => {
      const imageSets = createResponsiveImageSet(null)
      expect(imageSets).toEqual([])
    })

    it('calculates proper height from aspect ratio', () => {
      const mockImage = { 
        asset: { 
          _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
          _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
        }
      }
      const aspectRatio = 16/9 // 1.777...
      
      const imageSets = createResponsiveImageSet(mockImage, [800], ['jpg'], aspectRatio)
      
      const url = imageSets[0].sources[0].url
      expect(url).toContain('h=450') // 800 / (16/9) = 450
    })
  })

  describe('createLQIP', () => {
    it('creates low quality image placeholder', () => {
      const mockImage = { 
        asset: { 
          _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
          _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
        }
      }
      
      const lqipUrl = createLQIP(mockImage, 20, 20)
      
      expect(lqipUrl).toContain('w=20')
      expect(lqipUrl).toContain('q=20')
      expect(lqipUrl).toContain('fm=jpg')
      expect(lqipUrl).toContain('blur=5')
    })

    it('uses default values', () => {
      const mockImage = { 
        asset: { 
          _id: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg',
          _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
        }
      }
      
      const lqipUrl = createLQIP(mockImage)
      
      expect(lqipUrl).toContain('w=20')
      expect(lqipUrl).toContain('q=20')
    })
  })

  describe('extractImageMetadata', () => {
    it('extracts complete metadata from Sanity image object', () => {
      const mockImageObject = {
        asset: {
          metadata: {
            dimensions: {
              width: 1920,
              height: 1080,
              aspectRatio: 1.777777777777778
            },
            lqip: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
            blurHash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
            palette: {
              dominant: {
                background: '#a8b5c1',
                foreground: '#2d3748'
              }
            }
          }
        },
        hotspot: {
          x: 0.5,
          y: 0.3
        },
        crop: {
          top: 0.1,
          bottom: 0.1,
          left: 0.05,
          right: 0.05
        }
      }
      
      const metadata = extractImageMetadata(mockImageObject)
      
      expect(metadata.width).toBe(1920)
      expect(metadata.height).toBe(1080)
      expect(metadata.aspectRatio).toBe(1.777777777777778)
      expect(metadata.lqip).toBe('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...')
      expect(metadata.blurHash).toBe('LGF5]+Yk^6#M@-5c,1J5@[or[Q6.')
      expect(metadata.dominantColor).toBe('#a8b5c1')
      expect(metadata.hotspot).toEqual({ x: 0.5, y: 0.3 })
      expect(metadata.crop).toEqual({
        top: 0.1,
        bottom: 0.1,
        left: 0.05,
        right: 0.05
      })
    })

    it('handles missing metadata gracefully', () => {
      const metadata = extractImageMetadata({})
      expect(metadata).toEqual({})
    })

    it('handles partial metadata', () => {
      const mockImageObject = {
        asset: {
          metadata: {
            dimensions: {
              width: 800,
              height: 600
            }
          }
        }
      }
      
      const metadata = extractImageMetadata(mockImageObject)
      
      expect(metadata.width).toBe(800)
      expect(metadata.height).toBe(600)
      expect(metadata.aspectRatio).toBeUndefined()
      expect(metadata.hotspot).toBeUndefined()
    })
  })

  describe('calculateOptimalDimensions', () => {
    it('calculates dimensions with device pixel ratio', () => {
      const result = calculateOptimalDimensions(400, 300, undefined, 2)
      
      expect(result.width).toBe(800) // 400 * 2
      expect(result.height).toBe(600) // 300 * 2
    })

    it('calculates height from aspect ratio', () => {
      const result = calculateOptimalDimensions(800, undefined, 16/9, 1)
      
      expect(result.width).toBe(800)
      expect(result.height).toBe(450) // 800 / (16/9)
    })

    it('handles missing height and aspect ratio', () => {
      const result = calculateOptimalDimensions(400, undefined, undefined, 1)
      
      expect(result.width).toBe(400)
      expect(result.height).toBeUndefined()
    })
  })

  describe('generateSizesAttribute', () => {
    it('generates correct sizes attribute', () => {
      const breakpoints = [
        { maxWidth: 768, size: '100vw' },
        { minWidth: 769, maxWidth: 1200, size: '50vw' },
        { minWidth: 1201, size: '33vw' }
      ]
      
      const sizesAttr = generateSizesAttribute(breakpoints)
      
      expect(sizesAttr).toBe('(max-width: 768px) 100vw, (min-width: 769px) and (max-width: 1200px) 50vw, (min-width: 1201px) 33vw')
    })

    it('handles simple breakpoints', () => {
      const breakpoints = [
        { size: '100vw' }
      ]
      
      const sizesAttr = generateSizesAttribute(breakpoints)
      
      expect(sizesAttr).toBe('100vw')
    })
  })

  describe('ImagePerformanceMonitor', () => {
    beforeEach(() => {
      // Clear metrics before each test
      ImagePerformanceMonitor.getMetrics().clear()
    })

    it('tracks image loading performance', () => {
      const startTime = ImagePerformanceMonitor.startTiming('test-image.jpg')
      
      // Simulate some delay
      const endTime = startTime + 100
      vi.spyOn(performance, 'now').mockReturnValue(endTime)
      
      ImagePerformanceMonitor.endTiming('test-image.jpg', startTime, 'webp', false)
      
      const metrics = ImagePerformanceMonitor.getMetrics()
      expect(metrics.has('test-image.jpg')).toBe(true)
      
      const imageMetrics = metrics.get('test-image.jpg')
      expect(imageMetrics?.loadTime).toBe(100)
      expect(imageMetrics?.format).toBe('webp')
      expect(imageMetrics?.fromCache).toBe(false)
    })

    it('calculates average load time', () => {
      // Mock performance.now to return predictable values
      const mockNow = vi.spyOn(performance, 'now')
      
      // First timing: 100ms load time
      mockNow.mockReturnValueOnce(0).mockReturnValueOnce(100)
      const start1 = ImagePerformanceMonitor.startTiming('image1.jpg')
      ImagePerformanceMonitor.endTiming('image1.jpg', start1, 'jpg')
      
      // Second timing: 200ms load time  
      mockNow.mockReturnValueOnce(0).mockReturnValueOnce(200)
      const start2 = ImagePerformanceMonitor.startTiming('image2.jpg')
      ImagePerformanceMonitor.endTiming('image2.jpg', start2, 'webp')
      
      // Third timing: 300ms load time
      mockNow.mockReturnValueOnce(0).mockReturnValueOnce(300)
      const start3 = ImagePerformanceMonitor.startTiming('image3.jpg')
      ImagePerformanceMonitor.endTiming('image3.jpg', start3, 'avif')
      
      const avgTime = ImagePerformanceMonitor.getAverageLoadTime()
      expect(avgTime).toBe(200) // (100 + 200 + 300) / 3
    })
  })
})