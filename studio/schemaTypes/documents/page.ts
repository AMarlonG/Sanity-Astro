import {defineField, defineType} from 'sanity'
import {DocumentIcon, ComposeIcon, CogIcon} from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Faste sider',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      icon: DocumentIcon,
      default: true,
    },
    {
      name: 'content',
      title: 'Innhold',
      icon: ComposeIcon,
    },
    {
      name: 'scheduling',
      title: 'Tidsstyring',
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Navn på side',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (!value && context.document?.publishingStatus === 'published') {
          return 'Navn på side bør fylles ut før publisering'
        }
        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'Trykk generer for å lage URL',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().custom((value, context) => {
        if (!value?.current && context.document?.title) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'content',
      title: 'Sideinnhold',
      type: 'pageBuilder',
      description: 'Bygg siden med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'publishingStatus',
      title: 'Publiseringsstatus',
      type: 'string',
      options: {
        list: [
          { title: 'Synlig på nett umiddelbart', value: 'published' },
          { title: 'Lagre uten å bli synlig på nett', value: 'draft' },
          { title: 'Planlegg periode', value: 'scheduled' }
        ],
        layout: 'radio'
      },
      initialValue: 'published',
      validation: (Rule) => Rule.required(),
      group: 'scheduling',
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.publishingStatus !== 'scheduled',
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
          description: 'Når denne siden blir synlig på nettsiden',
          fieldset: 'timing',
          validation: (Rule) => Rule.required().custom((value, context) => {
            const status = context.document?.publishingStatus
            if (status === 'scheduled' && !value) {
              return 'Startdato må velges for planlagt periode'
            }
            if (status !== 'scheduled') {
              return true
            }
            return true
          }),
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når denne siden slutter å være synlig på nettsiden',
          fieldset: 'timing',
          validation: (Rule) => Rule.required().custom((value, context) => {
            const status = context.document?.publishingStatus
            if (status === 'scheduled' && !value) {
              return 'Sluttdato må velges for planlagt periode'
            }
            if (status !== 'scheduled') {
              return true
            }
            return true
          }),
        },
      ],
      group: 'scheduling',
    }),
  ],
})
