import {defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons'
import {componentValidation} from '../../shared/validation'

export const countdownComponent = defineType({
  name: 'countdownComponent',
  title: 'Nedtelling',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'targetEvent',
      title: 'Arrangement',
      type: 'reference',
      to: [{type: 'event'}],
      description: 'Velg hvilket arrangement det skal telles ned til',
      validation: (Rule) => Rule.required().error('Arrangement må velges'),
    }),
    defineField({
      name: 'style',
      title: 'Visuell stil',
      type: 'string',
      options: {
        list: [
          {title: 'Stor (hero)', value: 'large'},
          {title: 'Kompakt', value: 'compact'},
          {title: 'Minimal (tekstlinje)', value: 'minimal'},
        ],
        layout: 'radio',
      },
      initialValue: 'compact',
    }),
    defineField({
      name: 'completedMessage',
      title: 'Melding når nedtelling er ferdig',
      type: 'string',
      description: 'Tekst som vises når arrangementet har startet',
      initialValue: 'Arrangementet har startet!',
    }),
    defineField({
      name: 'hideWhenComplete',
      title: 'Skjul når ferdig',
      type: 'boolean',
      description: 'Skjul komponenten helt når nedtellingen er over',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      eventTitle: 'targetEvent.title',
      eventDate: 'targetEvent.eventDate.date',
      eventTime: 'targetEvent.eventTime.startTime',
      style: 'style',
    },
    prepare({eventTitle, eventDate, eventTime, style}) {
      const eventInfo = eventTitle
        ? `til ${eventTitle} (${new Date(eventDate).toLocaleDateString('nb-NO')} kl. ${eventTime})`
        : 'Ingen arrangement valgt'

      return {
        title: 'Nedtelling',
        subtitle: `${eventInfo} • ${style} stil`,
        media: ClockIcon,
      }
    },
  },
})