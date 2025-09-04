import {defineField, defineType} from 'sanity'
import {DocumentIcon, ImageIcon, ComposeIcon, CogIcon} from '@sanity/icons'

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
      name: 'image',
      title: 'Hovedbilde',
      icon: ImageIcon,
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
      title: 'Navn på artikkel',
      type: 'string',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Kun vis advarsel hvis brukeren prøver å publisere uten tittel
        if (!value && context.document?.publishingStatus === 'published') {
          return 'Navn på artikkel bør fylles ut før publisering'
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
        // Kun vis advarsel hvis tittel finnes men slug mangler
        if (!value?.current && context.document?.title) {
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
      description: 'Kort beskrivelse av artikkelen (vises i lister)',
      rows: 2,
      validation: (Rule) => Rule.max(100),
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
      name: 'image',
      title: 'Hovedbilde',
      type: 'image',
      description: 'Hovedbilde for artikkelen - brukes på artikkelsiden og når siden deles på sosiale medier',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Hovedbilde bør lastes opp'
        }
        return true
      }),
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'imageCredit',
      title: 'Kreditering',
      type: 'string',
      description: 'Hvem som har tatt eller eier bildet (f.eks. "Foto: John Doe" eller "Kilde: Unsplash")',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (context.document?.image && !value) {
          return 'Kreditering bør fylles ut når bilde er lastet opp'
        }
        return true
      }),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beskriv bildet for tilgjengelighet og SEO',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        if (context.document?.image && !value) {
          return 'Alt-tekst bør fylles ut når bilde er lastet opp'
        }
        return true
      }),
    }),
    defineField({
      name: 'imageCaption',
      title: 'Bildetekst',
      type: 'string',
      description: 'Valgfri tekst som kan vises med bildet',
      group: 'image',
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
          description: 'Når denne artikkelen blir synlig på nettsiden',
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
          description: 'Når denne artikkelen slutter å være synlig på nettsiden',
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
      title: 'title',
      excerpt: 'excerpt',
      publishingStatus: 'publishingStatus',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
    },
    prepare({title, excerpt, publishingStatus, startDate, endDate}) {
      // Status logic
      let statusText = 'Utkast';
      
      if (publishingStatus === 'published') {
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
