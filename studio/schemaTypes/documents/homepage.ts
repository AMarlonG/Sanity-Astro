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
      name: 'isDefault',
      title: 'Standard forside',
      type: 'boolean',
      description: 'Dette blir standard forsiden når ingen planlagt forside er aktiv',
      initialValue: false,
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.isDefault === true,
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
      isDefault: 'isDefault',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
    },
    prepare({title, isDefault, startDate, endDate}) {
      const subtitle = isDefault
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
