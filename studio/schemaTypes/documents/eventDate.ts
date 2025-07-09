import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export default defineType({
  name: 'eventDate',
  title: 'Arrangementsdatoer',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Ukedag',
      type: 'string',
      description: 'Dag i uken (f.eks. "Mandag", "Tirsdag", "Onsdag")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Dato',
      type: 'date',
      description: 'Faktisk dato for arrangementet',
      validation: (Rule) => Rule.required(),
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
      title: 'title',
      date: 'date',
      isActive: 'isActive',
    },
    prepare({title, date, isActive}) {
      const dateString = date ? new Date(date).toLocaleDateString('nb-NO') : 'Ingen dato'
      const status = isActive ? 'Aktiv' : 'Inaktiv'
      return {
        title: title,
        subtitle: `${dateString} • ${status}`,
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
