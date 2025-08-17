import {describe, it, expect, vi} from 'vitest'
import {structure} from './deskStructure'

vi.mock('sanity/structure', () => ({
  StructureBuilder: class {
    list() { return this }
    title() { return this }
    items() { return this }
    child() { return this }
    divider() { return this }
    listItem() { return this }
    icon() { return this }
    schemaType() { return this }
  }
}))

describe('Desk Structure', () => {
  it('should be a function', () => {
    expect(typeof structure).toBe('function')
  })

  it('should return a structure when called with StructureBuilder', () => {
    const mockDocument = {
      schemaType: vi.fn().mockReturnThis(),
      documentId: vi.fn().mockReturnThis()
    }

    const mockListItem = {
      title: vi.fn().mockReturnThis(),
      id: vi.fn().mockReturnThis(),
      icon: vi.fn().mockReturnThis(),
      child: vi.fn().mockReturnThis(),
      schemaType: vi.fn().mockReturnThis()
    }

    const mockS = {
      list: vi.fn().mockReturnThis(),
      title: vi.fn().mockReturnThis(),
      items: vi.fn().mockReturnThis(),
      child: vi.fn().mockReturnThis(),
      divider: vi.fn().mockReturnValue({divider: true}),
      listItem: vi.fn().mockReturnValue(mockListItem),
      icon: vi.fn().mockReturnThis(),
      schemaType: vi.fn().mockReturnThis(),
      document: vi.fn().mockReturnValue(mockDocument),
      documentTypeList: vi.fn().mockReturnThis(),
      documentTypeListItem: vi.fn().mockReturnThis()
    }

    const result = structure(mockS as any)
    
    expect(mockS.list).toHaveBeenCalled()
    expect(mockS.title).toHaveBeenCalledWith('Innhold')
    expect(result).toBeDefined()
  })
})