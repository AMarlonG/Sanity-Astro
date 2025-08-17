import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {imageComponent} from '../components/Image'
import {workflowFields, workflowGroup} from '../objects/workflowFields'
import {seoFields, seoGroup} from '../objects/seoFields'

export const artist = defineType({
  name: 'artist',
  title: 'Artister',
  type: 'document',
  icon: UserIcon,
  groups: [
    {
      name: 'basic',
      title: 'Grunnleggende informasjon',
      default: true,
    },
    {
      name: 'image',
      title: 'Bilde',
    },
    {
      name: 'links',
      title: 'Lenker',
    },
    {
      name: 'content',
      title: 'Innhold',
    },
    {
      name: 'scheduling',
      title: 'Tidsstyring',
    },
    workflowGroup,
    seoGroup,
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'URL-en som brukes for å finne denne artisten på nettsiden',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'imageComponent',
      description: 'Bilde av artisten med alt-tekst og kreditering',
      group: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instrument',
      title: 'Instrument',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Nettside',
      type: 'url',
      description: 'Artistens offisielle nettside',
      group: 'links',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Sosiale medier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plattform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter/X', value: 'twitter'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Spotify', value: 'spotify'},
                  {title: 'SoundCloud', value: 'soundcloud'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Annet', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Lenke til artistens profil på denne plattformen',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'customLabel',
              title: 'Egendefinert etikett',
              type: 'string',
              description: 'Valgfri egendefinert etikett (f.eks. "Bandcamp" eller "Apple Music")',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url',
              customLabel: 'customLabel',
            },
            prepare({platform, url, customLabel}) {
              const platformLabels: Record<string, string> = {
                facebook: 'Facebook',
                instagram: 'Instagram',
                twitter: 'Twitter/X',
                youtube: 'YouTube',
                spotify: 'Spotify',
                soundcloud: 'SoundCloud',
                tiktok: 'TikTok',
                linkedin: 'LinkedIn',
                other: 'Annet',
              }

              const label =
                customLabel || platformLabels[platform as keyof typeof platformLabels] || platform
              return {
                title: label,
                subtitle: url,
              }
            },
          },
        },
      ],
      description: 'Legg til lenker til artistens sosiale medier',
      group: 'links',
    }),
    defineField({
      name: 'content',
      title: 'Artistinnhold',
      type: 'pageBuilder',
      description: 'Bygg artist-siden med komponenter og innhold',
      group: 'content',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publisert',
      type: 'boolean',
      description: 'Denne artisten er synlig på nettsiden',
      group: 'scheduling',
      initialValue: false,
    }),
    defineField({
      name: 'scheduledPeriod',
      title: 'Planlagt periode',
      type: 'object',
      hidden: ({document}) => document?.isPublished === true,
      group: 'scheduling',
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
        },
        {
          name: 'endDate',
          title: 'Sluttdato',
          type: 'datetime',
          description: 'Når denne artisten slutter å være synlig på nettsiden',
          fieldset: 'timing',
        },
      ],
    }),
    // Add workflow fields
    ...workflowFields,
    // Add SEO fields
    ...seoFields,
  ],
  preview: {
    select: {
      name: 'name',
      instrument: 'instrument',
      country: 'country',
      isPublished: 'isPublished',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
      editorialStatus: 'editorialStatus',
      assignedTo: 'assignedTo',
      media: 'image.image',
    },
    prepare({name, instrument, country, isPublished, startDate, endDate, editorialStatus, assignedTo, media}) {
      // Editorial status icons
      const workflowIcons = {
        draft: '📝',
        review: '👁️', 
        approved: '✅',
        published: '🚀',
        archived: '📦'
      };
      
      // Publication status logic
      let pubStatusIcon = '⚫'; // Default: draft
      let pubStatusText = 'Utkast';
      
      if (isPublished) {
        pubStatusIcon = '🟢';
        pubStatusText = 'Publisert';
      } else if (startDate && endDate) {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now >= start && now <= end) {
          pubStatusIcon = '🟢';
          pubStatusText = 'Live';
        } else if (now < start) {
          pubStatusIcon = '🟡';
          pubStatusText = 'Venter';
        } else {
          pubStatusIcon = '🔴';
          pubStatusText = 'Utløpt';
        }
      }
      
      const workflowIcon = workflowIcons[editorialStatus] || '📝';
      const assignedText = assignedTo ? ` • ${assignedTo}` : '';
      
      return {
        title: `${workflowIcon}${pubStatusIcon} ${name}`,
        subtitle: `${instrument} • ${country} • ${pubStatusText}${assignedText}`,
        media: media || '🎤',
      };
    },
  },
})
