import {defineField} from 'sanity'

/**
 * Reusable scheduling fields for documents that need publish control
 * Used by: events, artists, articles, homepages
 */

export const schedulingFields = [
  defineField({
    name: 'isPublished',
    title: '🟢 Publisert',
    type: 'boolean',
    description: 'Når dette er aktivert, vises innholdet på nettsiden',
    initialValue: false,
    group: 'publishing',
  }),
  
  defineField({
    name: 'scheduledPeriod',
    title: '📅 Planlagt periode',
    type: 'object',
    description: 'Valgfritt: Sett en periode hvor innholdet automatisk vises',
    group: 'publishing',
    hidden: ({document}) => document?.isPublished === true,
    fields: [
      defineField({
        name: 'startDate',
        title: 'Start dato',
        type: 'datetime',
        description: 'Når innholdet blir synlig',
        validation: (Rule) => Rule.required(),
        options: {
          dateFormat: 'DD.MM.YYYY',
          timeFormat: 'HH:mm',
        },
      }),
      defineField({
        name: 'endDate',
        title: 'Slutt dato',
        type: 'datetime',
        description: 'Når innholdet blir skjult igjen',
        validation: (Rule) =>
          Rule.required().min(Rule.valueOfField('startDate')).error('Slutt dato må være etter start dato'),
        options: {
          dateFormat: 'DD.MM.YYYY',
          timeFormat: 'HH:mm',
        },
      }),
    ],
  }),
]

// Helper to add publishing group to document schemas
export const publishingGroup = {
  name: 'publishing',
  title: '📤 Publisering',
  icon: '📤',
}