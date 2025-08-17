import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'

// Mock sanityClient completely
vi.mock('sanity:client', () => ({
  sanityClient: {
    fetch: vi.fn()
  }
}))

// Import after mocking
import {getActiveHomepage} from './homepage'
import {sanityClient} from 'sanity:client'

describe('getActiveHomepage', () => {
  beforeEach(() => {
    vi.mocked(sanityClient.fetch).mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns scheduled homepage when within active period', async () => {
    const mockDate = new Date('2024-06-15T12:00:00Z')
    vi.setSystemTime(mockDate)

    const mockScheduledHomepage = {
      _id: 'scheduled-1',
      title: 'Summer Campaign',
      content: [],
      isDefault: false,
      scheduledPeriod: {
        startDate: '2024-06-01T00:00:00Z',
        endDate: '2024-06-30T23:59:59Z'
      }
    }

    // Mock first query to return scheduled homepage
    vi.mocked(sanityClient.fetch).mockResolvedValueOnce(mockScheduledHomepage)

    const result = await getActiveHomepage()

    expect(result).toEqual(mockScheduledHomepage)
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledWith(
      expect.stringContaining('scheduledPeriod.startDate <= $now'),
      {now: mockDate.toISOString()}
    )
  })

  it('returns default homepage when no scheduled homepage is active', async () => {
    const mockDate = new Date('2024-05-15T12:00:00Z')
    vi.setSystemTime(mockDate)

    const mockDefaultHomepage = {
      _id: 'default-1',
      title: 'Default Homepage',
      content: [],
      isDefault: true,
      scheduledPeriod: null
    }

    // Mock first query (scheduled) to return null, second query (default) to return homepage
    vi.mocked(sanityClient.fetch)
      .mockResolvedValueOnce(null) // No scheduled homepage
      .mockResolvedValueOnce(mockDefaultHomepage) // Default homepage

    const result = await getActiveHomepage()

    expect(result).toEqual(mockDefaultHomepage)
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledTimes(2)
    
    // Verify second call queries for default homepage
    const secondCall = vi.mocked(sanityClient.fetch).mock.calls[1]
    expect(secondCall[0]).toContain('isDefault == true')
  })

  it('handles expired scheduled homepage correctly', async () => {
    const mockDate = new Date('2024-07-15T12:00:00Z')
    vi.setSystemTime(mockDate)

    const mockDefaultHomepage = {
      _id: 'default-1',
      title: 'Default Homepage',
      content: [],
      isDefault: true,
      scheduledPeriod: null
    }

    // No active scheduled homepage (expired)
    vi.mocked(sanityClient.fetch)
      .mockResolvedValueOnce(null) // No scheduled
      .mockResolvedValueOnce(mockDefaultHomepage) // Default

    const result = await getActiveHomepage()

    expect(result).toEqual(mockDefaultHomepage)
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledTimes(2)
  })

  it('prioritizes most recent scheduled homepage when multiple are active', async () => {
    const mockDate = new Date('2024-06-15T12:00:00Z')
    vi.setSystemTime(mockDate)

    const mockNewestScheduled = {
      _id: 'scheduled-newest',
      title: 'Newest Campaign',
      content: [],
      isDefault: false,
      scheduledPeriod: {
        startDate: '2024-06-10T00:00:00Z',
        endDate: '2024-06-20T23:59:59Z'
      }
    }

    // Mock first query to return the newest scheduled homepage
    vi.mocked(sanityClient.fetch).mockResolvedValueOnce(mockNewestScheduled)

    const result = await getActiveHomepage()

    expect(result).toEqual(mockNewestScheduled)
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledTimes(1)
    
    // Verify query includes ordering by startDate desc
    const queryCall = vi.mocked(sanityClient.fetch).mock.calls[0]
    expect(queryCall[0]).toContain('order(scheduledPeriod.startDate desc)[0]')
  })

  it('returns null when no homepage is available', async () => {
    const mockDate = new Date('2024-05-15T12:00:00Z')
    vi.setSystemTime(mockDate)

    // Mock both queries to return null
    vi.mocked(sanityClient.fetch)
      .mockResolvedValueOnce(null) // No scheduled
      .mockResolvedValueOnce(null) // No default

    const result = await getActiveHomepage()

    expect(result).toBeNull()
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledTimes(2)
  })

  it('handles sanity client errors gracefully', async () => {
    const mockDate = new Date('2024-06-15T12:00:00Z')
    vi.setSystemTime(mockDate)

    // Mock first query to throw error, second to return default
    const mockDefaultHomepage = {
      _id: 'default-1',
      title: 'Default Homepage',
      content: [],
      isDefault: true,
      scheduledPeriod: null
    }

    vi.mocked(sanityClient.fetch)
      .mockRejectedValueOnce(new Error('Sanity API error'))
      .mockResolvedValueOnce(mockDefaultHomepage)

    // Should not throw and should fall back to default
    const result = await getActiveHomepage()

    expect(result).toEqual(mockDefaultHomepage)
    expect(vi.mocked(sanityClient.fetch)).toHaveBeenCalledTimes(2)
  })
})