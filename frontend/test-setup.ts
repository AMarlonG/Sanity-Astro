import {vi} from 'vitest'

// Mock environment variables if needed
process.env.PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
process.env.PUBLIC_SANITY_DATASET = 'test-dataset'

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock IntersectionObserver if needed for component tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))