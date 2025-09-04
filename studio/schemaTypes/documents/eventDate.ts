import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventDate = defineType({
  name: 'eventDate',
  title: 'Festivaldatoer',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'date',
      title: 'Festivaldato',
      type: 'date',
      description: 'Velg dato for arrangementet (ukedag vises automatisk)',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Dato må velges'
        }
        return true
      }),
    }),

    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'Trykk generer for å lage URL',
      options: {
        source: (doc) => {
          if (doc.date) {
            const dateObj = new Date(doc.date)
            const weekdays = ['sondag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lordag']
            const weekday = weekdays[dateObj.getDay()]
            const dateString = dateObj.toLocaleDateString('nb-NO')
            return `${weekday}-${dateString.replace(/\./g, '-').replace(/--/g, '-')}`
          }
          return 'festivaldato'
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (!value?.current && context.document?.date) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
    }),

    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Er denne datoen aktiv og tilgjengelig for arrangementer?',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      date: 'date',
      isActive: 'isActive',
    },
    prepare({date, isActive}) {
      if (!date) {
        return {
          title: 'Ingen dato',
          subtitle: isActive ? 'Aktiv' : 'Inaktiv',
          media: CalendarIcon,
        }
      }
      
      const dateObj = new Date(date)
      const weekdays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
      const weekday = weekdays[dateObj.getDay()]
      const dateString = dateObj.toLocaleDateString('nb-NO')
      const status = isActive ? 'Aktiv' : 'Inaktiv'
      
      return {
        title: `${weekday} ${dateString}`,
        subtitle: status,
        media: CalendarIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Dato, nyeste først',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Dato, eldste først',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
})
