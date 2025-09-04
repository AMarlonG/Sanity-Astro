import {defineField, defineType} from 'sanity'
import {UserIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'

export const artist = defineType({
  name: 'artist',
  title: 'Artister',
  type: 'document',
  icon: UserIcon,
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      icon: UserIcon,
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
      name: 'name',
      title: 'Navn på artist',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis brukeren prøver å publisere uten navn
        if (!value && context.document?.isPublished) {
          return 'Navn på artist bør fylles ut før publisering'
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
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis navn finnes men slug mangler
        if (!value?.current && context.document?.name) {
          return 'Trykk generer for å lage URL'
        }
        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      description: 'Kort beskrivelse av artisten (vises i lister)',
      rows: 2,
      validation: (Rule) => Rule.max(100),
      group: 'basic',
    }),
    defineField({
      name: 'instrument',
      title: 'Instrument',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Instrument må fylles ut'
        }
        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Land må fylles ut'
        }
        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'content',
      title: 'Artistinnhold',
      type: 'pageBuilder',
      description: 'Bygg artist-siden med komponenter og innhold',
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
          description: 'Når denne artisten blir synlig på nettsiden',
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
          description: 'Når denne artisten slutter å være synlig på nettsiden',
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
  preview: {
    select: {
      name: 'name',
      instrument: 'instrument',
      country: 'country',
      isPublished: 'isPublished',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
      media: 'image.image',
    },
    prepare({name, instrument, country, isPublished, startDate, endDate, media}) {
      // Publication status logic
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
        title: name,
        subtitle: `${instrument} • ${country} • ${statusText}`,
        media: media,
      };
    },
  },
})
