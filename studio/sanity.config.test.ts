import {describe, it, expect} from 'vitest'
import config from './sanity.config'

describe('Sanity Studio Configuration', () => {
  it('should have correct project configuration', () => {
    expect(config.name).toBe('default')
    expect(config.title).toBe('studio')
    expect(config.projectId).toBe('i952bgb1')
    expect(config.dataset).toBe('production')
  })

  it('should have required plugins configured', () => {
    expect(config.plugins).toBeDefined()
    expect(Array.isArray(config.plugins)).toBe(true)
    expect(config.plugins.length).toBeGreaterThan(0)
  })

  it('should have schema types configured', () => {
    expect(config.schema).toBeDefined()
    expect(config.schema.types).toBeDefined()
    expect(Array.isArray(config.schema.types)).toBe(true)
  })
})