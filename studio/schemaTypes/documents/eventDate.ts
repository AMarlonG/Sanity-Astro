import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const eventDate = defineType({
  name: 'eventDate',
  title: 'Arrangementsdatoer',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'date',
      title: 'Arrangementsdato',
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
