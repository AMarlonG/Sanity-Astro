import {describe, it, expect, vi, beforeEach} from 'vitest'
import {createSanityLoader} from './sanityLoader'

// Mock Sanity client
vi.mock('sanity:client', () => ({
  sanityClient: {
    fetch: vi.fn()
  }
}))

import {sanityClient} from 'sanity:client'

describe('Sanity Content Loader', () => {
  let mockStore: any
  let mockParseData: any
  let mockLogger: any
  let mockMeta: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockStore = {
      clear: vi.fn(),
      set: vi.fn()
    }
    
    mockParseData = vi.fn().mockImplementation(({data}) => data)
    
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }
    
    mockMeta = {
      get: vi.fn(),
      set: vi.fn()
    }
  })

  describe('createSanityLoader', () => {
    it('creates a loader with correct name', () => {
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      expect(loader.name).toBe('sanity-loader-test')
    })

    it('loads content successfully', async () => {
      const mockData = [
        { _id: '1', title: 'Test 1', _updatedAt: '2025-01-01T00:00:00Z' },
        { _id: '2', title: 'Test 2', _updatedAt: '2025-01-01T00:00:00Z' }
      ]
      
      vi.mocked(sanityClient.fetch).mockResolvedValueOnce(mockData)
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      await loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })
      
      expect(mockLogger.info).toHaveBeenCalledWith('Loading Sanity content for type: test')
      expect(mockLogger.info).toHaveBeenCalledWith('Fetched 2 entries from Sanity')
      expect(mockStore.clear).toHaveBeenCalled()
      expect(mockStore.set).toHaveBeenCalledTimes(2)
      expect(mockMeta.set).toHaveBeenCalledWith('lastSync', expect.any(String))
    })

    it('handles empty results', async () => {
      vi.mocked(sanityClient.fetch).mockResolvedValueOnce([])
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      await loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })
      
      expect(mockLogger.info).toHaveBeenCalledWith('Fetched 0 entries from Sanity')
      expect(mockStore.set).not.toHaveBeenCalled()
    })

    it('handles non-array responses', async () => {
      vi.mocked(sanityClient.fetch).mockResolvedValueOnce({not: 'array'})
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      await loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })
      
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Expected array from Sanity query, got object'
      )
    })

    it('skips entries without _id', async () => {
      const mockData = [
        { _id: '1', title: 'Valid' },
        { title: 'Invalid - no ID' },
        { _id: '2', title: 'Also valid' }
      ]
      
      vi.mocked(sanityClient.fetch).mockResolvedValueOnce(mockData)
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      await loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })
      
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Skipping entry without _id:',
        { title: 'Invalid - no ID' }
      )
      expect(mockStore.set).toHaveBeenCalledTimes(2) // Only valid entries
    })

    it('applies custom content parsing', async () => {
      const mockData = [
        { _id: '1', slug: { current: 'test-slug' } }
      ]
      
      vi.mocked(sanityClient.fetch).mockResolvedValueOnce(mockData)
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test',
        parseContent: (entry: any) => ({
          ...entry,
          slug: entry.slug?.current || ''
        })
      }
      
      const loader = createSanityLoader(config)
      
      await loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })
      
      expect(mockParseData).toHaveBeenCalledWith({
        id: '1',
        data: { _id: '1', slug: 'test-slug' }
      })
    })

    it('handles API errors gracefully', async () => {
      const error = new Error('Sanity API error')
      vi.mocked(sanityClient.fetch).mockRejectedValueOnce(error)
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      await expect(loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })).rejects.toThrow('Sanity API error')
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to load Sanity content:',
        error
      )
    })

    it('generates consistent digests for content', async () => {
      const mockData = [
        { _id: '1', title: 'Test', content: 'Same content' }
      ]
      
      vi.mocked(sanityClient.fetch).mockResolvedValueOnce(mockData)
      
      const config = {
        query: '*[_type == "test"]',
        type: 'test'
      }
      
      const loader = createSanityLoader(config)
      
      await loader.load({
        store: mockStore,
        parseData: mockParseData,
        logger: mockLogger,
        meta: mockMeta
      })
      
      const firstCall = mockStore.set.mock.calls[0][0]
      expect(firstCall.digest).toMatch(/^[a-f0-9]{64}$/) // SHA-256 hash
    })
  })
})