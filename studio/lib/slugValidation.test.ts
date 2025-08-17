import {describe, it, expect, vi, beforeEach} from 'vitest'
import {createUniqueSlugValidation, genreSlugValidation} from './slugValidation'

// Mock Sanity client
const mockClient = {
  fetch: vi.fn()
}

const mockGetClient = vi.fn(() => mockClient)

const createMockContext = (documentId?: string) => ({
  document: {
    _id: documentId || 'test-doc-id'
  },
  getClient: mockGetClient
})

describe('slugValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createUniqueSlugValidation', () => {
    it('returns true for undefined slug', async () => {
      const validation = createUniqueSlugValidation('genre')
      const context = createMockContext()
      
      const result = await validation(undefined, context)
      
      expect(result).toBe(true)
      expect(mockClient.fetch).not.toHaveBeenCalled()
    })

    it('returns true for slug without current value', async () => {
      const validation = createUniqueSlugValidation('genre')
      const context = createMockContext()
      const slug = {} as any
      
      const result = await validation(slug, context)
      
      expect(result).toBe(true)
      expect(mockClient.fetch).not.toHaveBeenCalled()
    })

    it('returns true when no duplicate is found', async () => {
      const validation = createUniqueSlugValidation('genre')
      const context = createMockContext('current-doc-id')
      const slug = {current: 'unique-slug'}
      
      mockClient.fetch.mockResolvedValueOnce(null)
      
      const result = await validation(slug, context)
      
      expect(result).toBe(true)
      expect(mockClient.fetch).toHaveBeenCalledWith(
        '*[_type == $type && slug.current == $slug && _id != $id][0]',
        {
          type: 'genre',
          slug: 'unique-slug',
          id: 'current-doc-id'
        }
      )
    })

    it('returns error message when duplicate is found', async () => {
      const validation = createUniqueSlugValidation('genre')
      const context = createMockContext('current-doc-id')
      const slug = {current: 'duplicate-slug'}
      
      mockClient.fetch.mockResolvedValueOnce({_id: 'other-doc'})
      
      const result = await validation(slug, context)
      
      expect(result).toBe('Slug "duplicate-slug" is already in use. Please choose a different one.')
    })

    it('handles draft document IDs correctly', async () => {
      const validation = createUniqueSlugValidation('venue')
      const context = createMockContext('drafts.some-doc-id')
      const slug = {current: 'test-slug'}
      
      mockClient.fetch.mockResolvedValueOnce(null)
      
      await validation(slug, context)
      
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          id: 'some-doc-id' // Should strip 'drafts.' prefix
        })
      )
    })

    it('gracefully handles client errors', async () => {
      const validation = createUniqueSlugValidation('genre')
      const context = createMockContext()
      const slug = {current: 'test-slug'}
      
      mockClient.fetch.mockRejectedValueOnce(new Error('Network error'))
      
      const result = await validation(slug, context)
      
      expect(result).toBe(true) // Should gracefully degrade
    })

    it('uses correct document type in query', async () => {
      const validation = createUniqueSlugValidation('customType')
      const context = createMockContext()
      const slug = {current: 'test-slug'}
      
      mockClient.fetch.mockResolvedValueOnce(null)
      
      await validation(slug, context)
      
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          type: 'customType'
        })
      )
    })
  })

  describe('pre-configured validators', () => {
    it('genreSlugValidation is configured for genre type', async () => {
      const context = createMockContext()
      const slug = {current: 'test-slug'}
      
      mockClient.fetch.mockResolvedValueOnce(null)
      
      await genreSlugValidation(slug, context)
      
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          type: 'genre'
        })
      )
    })
  })
})