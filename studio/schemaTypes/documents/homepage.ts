import {defineField, defineType} from 'sanity'
import {DocumentIcon, ComposeIcon, CogIcon} from '@sanity/icons'
import {createMirrorPortableTextInput} from '../../components/inputs/MirrorPortableTextInput'
import {seoFields, seoGroup} from '../objects/seoFields'

export const homepage = defineType({
  name: 'homepage',
  title: 'Forsider',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'admin',
      title: 'Administrativt',
      icon: CogIcon,
      default: true,
    },
    {
      name: 'no',
      title: '🇳🇴 Norsk',
      icon: ComposeIcon,
    },
    {
      name: 'en',
      title: '🇬🇧 English',
      icon: ComposeIcon,
    },
    {
      name: 'settings',
      title: 'Publisering',
      icon: CogIcon,
    },
    seoGroup,
  ],
  fields: [
    // ADMINISTRATIVT
    defineField({
      name: 'adminTitle',
      title: 'Administrativ tittel',
      type: 'string',
      description: '⚠️ Kun for Studio-oversikt - vises IKKE på nettsiden. Bruk beskrivende navn som "Juleforsiden 2024" eller "Påskekampanje"',
      validation: (Rule) => Rule.required(),
      group: 'admin',
    }),

    // NORSK INNHOLD
    defineField({
      name: 'content_no',
      title: 'Sideinnhold (norsk)',
      type: 'pageBuilder',
      description: 'Bygg norsk forside med komponenter og innhold. Start med en H1-overskrift som blir sidens hovedtittel',
      group: 'no',
    }),

    // ENGELSK INNHOLD
    defineField({
      name: 'content_en',
      title: 'Page content (English)',
      type: 'pageBuilder',
      description: 'Build English homepage with components and content. Start with an H1 heading that becomes the page main title',
      group: 'en',
      components: {
        input: createMirrorPortableTextInput('content_no')
      },
    }),

    // PUBLISERING
    defineField({
      name: 'homePageType',
      title: 'Forsidetype',
      type: 'string',
      description: 'Velg forsidetype',
      group: 'settings',
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
      group: 'settings',
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
    ...seoFields,
  ],
  preview: {
    select: {
      adminTitle: 'adminTitle',
      homePageType: 'homePageType',
      startDate: 'scheduledPeriod.startDate',
      endDate: 'scheduledPeriod.endDate',
      hasNorwegian: 'content_no',
      hasEnglish: 'content_en',
    },
    prepare({adminTitle, homePageType, startDate, endDate, hasNorwegian, hasEnglish}) {
      // Language status
      const languages: string[] = [];
      if (hasNorwegian) languages.push('🇳🇴');
      if (hasEnglish) languages.push('🇬🇧');
      const langStatus = languages.length > 0 ? ` • ${languages.join(' ')}` : '';

      // Period status
      const periodStatus = homePageType === 'default'
        ? 'Standard forside'
        : startDate && endDate
          ? `${new Date(startDate).toLocaleDateString('nb-NO')} ${new Date(startDate).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'})} → ${new Date(endDate).toLocaleDateString('nb-NO')} ${new Date(endDate).toLocaleTimeString('nb-NO', {hour: '2-digit', minute: '2-digit'})}`
          : 'Ingen periode satt';

      return {
        title: adminTitle || 'Uten tittel',
        subtitle: `${periodStatus}${langStatus}`,
        media: DocumentIcon,
      }
    },
  },
})
