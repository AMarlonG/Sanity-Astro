import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const homepage = defineType({
  name: 'homepage',
  title: 'Forsider',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'homePageType',
      title: 'Forsidetype',
      type: 'string',
      description: 'Velg forsidetype',
      options: {
        list: [
          {title: 'Standard forside', value: 'default'},
          {title: 'Planlagt forside', value: 'scheduled'}
        ],
        layout: 'radio'
      },
      initialValue: 'scheduled',
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.homePageType === 'default',
      fieldsets: [
        {
          name: 'timing',
          options: {columns: 2},
        },
      ],
      fields: [
        {
          name: 'startDate',
          title: 'Startdato',
          type: 'datetime',
          description: 'Når denne forsiden blir aktiv',
          fieldset: 'timing',
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når denne forsiden slutter å være aktiv',
          fieldset: 'timing',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg forsiden med komponenter og innhold',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      homePageType: 'homePageType',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
    },
    prepare({title, homePageType, startDate, endDate}) {
      const subtitle = homePageType === 'default'
        ? 'Standard forside'
        : startDate && endDate
          ? `${new Date(startDate).toLocaleDateString('nb-NO')} ${new Date(startDate).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'})} → ${new Date(endDate).toLocaleDateString('nb-NO')} ${new Date(endDate).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'})}`
          : 'Ingen periode satt'

      return {
        title: title || 'Uten tittel',
        subtitle,
      }
    },
  },
})
