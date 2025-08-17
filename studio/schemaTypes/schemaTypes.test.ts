import {describe, it, expect} from 'vitest'
import {schemaTypes} from './index'

describe('Schema Types', () => {
  it('should export an array of schema types', () => {
    expect(Array.isArray(schemaTypes)).toBe(true)
    expect(schemaTypes.length).toBeGreaterThan(0)
  })

  it('should have valid schema type structure', () => {
    schemaTypes.forEach(type => {
      expect(type).toHaveProperty('name')
      expect(type).toHaveProperty('type')
      expect(typeof type.name).toBe('string')
      expect(typeof type.type).toBe('string')
    })
  })

  it('should contain expected document types', () => {
    const expectedDocTypes = ['siteSettings', 'homepage', 'page', 'article', 'artist', 'event', 'eventDate', 'genre', 'venue']
    const schemaNames = schemaTypes.map(type => type.name)
    
    expectedDocTypes.forEach(docType => {
      expect(schemaNames).toContain(docType)
    })
  })

  it('should contain component types', () => {
    const componentTypes = ['pageBuilder', 'headingComponent', 'title', 'linkComponent', 'quoteComponent', 'buttonComponent', 'accordionComponent', 'imageComponent', 'videoComponent', 'portableText', 'portableTextBlock', 'columnLayout']
    const schemaNames = schemaTypes.map(type => type.name)
    
    componentTypes.forEach(compType => {
      expect(schemaNames).toContain(compType)
    })
  })

  it('should contain section types', () => {
    const sectionTypes = ['artistScrollContainer', 'contentScrollContainer', 'eventScrollContainer']
    const schemaNames = schemaTypes.map(type => type.name)
    
    sectionTypes.forEach(sectionType => {
      expect(schemaNames).toContain(sectionType)
    })
  })
})