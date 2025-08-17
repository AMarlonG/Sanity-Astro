import {describe, it, expect} from 'vitest'
import {generateTimeOptions, eventTimeOptions} from './timeUtils'

describe('timeUtils', () => {
  describe('generateTimeOptions', () => {
    it('generates 15-minute intervals correctly', () => {
      const options = generateTimeOptions(15, 0, 1)
      
      expect(options).toEqual([
        {title: '00:00', value: '00:00'},
        {title: '00:15', value: '00:15'},
        {title: '00:30', value: '00:30'},
        {title: '00:45', value: '00:45'},
        {title: '01:00', value: '01:00'},
        {title: '01:15', value: '01:15'},
        {title: '01:30', value: '01:30'},
        {title: '01:45', value: '01:45'},
      ])
    })

    it('generates 30-minute intervals correctly', () => {
      const options = generateTimeOptions(30, 0, 1)
      
      expect(options).toEqual([
        {title: '00:00', value: '00:00'},
        {title: '00:30', value: '00:30'},
        {title: '01:00', value: '01:00'},
        {title: '01:30', value: '01:30'},
      ])
    })

    it('handles custom hour ranges', () => {
      const options = generateTimeOptions(60, 9, 10)
      
      expect(options).toEqual([
        {title: '09:00', value: '09:00'},
        {title: '10:00', value: '10:00'},
      ])
    })

    it('pads single digits with zeros', () => {
      const options = generateTimeOptions(60, 0, 0)
      
      expect(options[0]).toEqual({title: '00:00', value: '00:00'})
    })
  })

  describe('eventTimeOptions', () => {
    it('generates correct number of options for full day', () => {
      // 24 hours * 4 intervals per hour = 96 options
      expect(eventTimeOptions).toHaveLength(96)
    })

    it('starts with 00:00', () => {
      expect(eventTimeOptions[0]).toEqual({title: '00:00', value: '00:00'})
    })

    it('ends with 23:45', () => {
      expect(eventTimeOptions[eventTimeOptions.length - 1]).toEqual({
        title: '23:45', 
        value: '23:45'
      })
    })

    it('includes common times', () => {
      const values = eventTimeOptions.map(option => option.value)
      expect(values).toContain('12:00')
      expect(values).toContain('18:30')
      expect(values).toContain('20:15')
    })
  })
})