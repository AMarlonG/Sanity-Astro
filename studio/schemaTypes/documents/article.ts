import {defineField, defineType} from 'sanity'
import {DocumentIcon, ComposeIcon, CogIcon} from '@sanity/icons'

export const article = defineType({
  name: 'article',
  title: 'Artikler',
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
      title: 'Hovedtittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av artikkelen (vises i lister)',
      rows: 2,
      validation: (Rule) => Rule.required().max(100),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne artikkelen på nettsiden',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'content',
      title: 'Artikkelinnhold',
      type: 'pageBuilder',
      description: 'Bygg artikkelen med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publisering',
      type: 'boolean',
      description: 'På: Synlig på nettsiden | Av: Skjult på nettsiden | Slett: Fjern helt (bruk slett-knappen)',
      initialValue: false,
      group: 'scheduling',
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.isPublished === true,
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
          description: 'Når denne artikkelen blir synlig på nettsiden',
          fieldset: 'timing',
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når denne artikkelen slutter å være synlig på nettsiden',
          fieldset: 'timing',
        },
      ],
      group: 'scheduling',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      excerpt: 'excerpt',
      isPublished: 'isPublished',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
    },
    prepare({title, excerpt, isPublished, startDate, endDate}) {
      // Status logic
      let statusText = 'Utkast';
      
      if (isPublished) {
        statusText = 'Publisert';
      } else if (startDate && endDate) {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now >= start && now <= end) {
          statusText = 'Live';
        } else if (now < start) {
          statusText = 'Venter';
        } else {
          statusText = 'Utløpt';
        }
      }
      
      return {
        title: title,
        subtitle: `${excerpt || 'Ingen ingress'} • ${statusText}`,
        media: DocumentIcon,
      };
    },
  },
})
