import {defineField} from 'sanity'
import {ClipboardIcon} from '@sanity/icons'

/**
 * Workflow status tracking for editorial control
 */
export const workflowFields = [
  defineField({
    name: 'editorialStatus',
    title: 'Redaksjonell status',
    type: 'string',
    group: 'workflow',
    initialValue: 'draft',
    options: {
      list: [
        {title: 'Utkast', value: 'draft'},
        {title: 'Til gjennomgang', value: 'review'},
        {title: 'Godkjent', value: 'approved'},
        {title: 'Publisert', value: 'published'},
        {title: 'Arkivert', value: 'archived'},
      ],
      layout: 'radio',
    },
    validation: (Rule) => Rule.required(),
  }),
  
  defineField({
    name: 'assignedTo',
    title: 'Tildelt til',
    type: 'string',
    group: 'workflow',
    description: 'Hvem som er ansvarlig for dette innholdet',
  }),
  
  defineField({
    name: 'workflowNotes',
    title: 'Arbeidsnotater',
    type: 'text',
    group: 'workflow',
    rows: 3,
    description: 'Interne notater om innholdet (vises ikke på nettsiden)',
  }),
  
  defineField({
    name: 'reviewDeadline',
    title: 'Gjennomgangsfrist',
    type: 'datetime',
    group: 'workflow',
    description: 'Når må dette være ferdig?',
    hidden: ({document}) => !['review', 'approved'].includes(document?.editorialStatus),
  }),
]

// Helper to add workflow group to document schemas
export const workflowGroup = {
  name: 'workflow',
  title: 'Arbeidsflyt',
  icon: ClipboardIcon,
}