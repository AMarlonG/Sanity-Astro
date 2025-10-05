import {defineType} from 'sanity'
import {
  DocumentIcon,
  ImageIcon,
  PlayIcon,
  LinkIcon,
  TiersIcon,
  TextIcon,
  EllipsisHorizontalIcon,
  AddCommentIcon,
  BlockContentIcon,
  BoltIcon,
  CalendarIcon,
  ExpandIcon,
  ClockIcon,
} from '@sanity/icons'

export const pageBuilderWithoutTitle = defineType({
  name: 'pageBuilderWithoutTitle',
  title: 'Sideinnhold (Uten Tittel)',
  type: 'array',
  icon: DocumentIcon,
  description: 'Bygg siden med komponenter og innhold - Tittel-komponenten er fjernet',
  options: {
    insertMenu: {
      filter: true,
      groups: [
        {
          name: 'layout',
          title: 'Layout & Struktur',
          of: ['columnLayout', 'gridLayout', 'spacer'],
        },
        {
          name: 'content',
          title: 'Innhold',
          of: ['headingComponent', 'portableTextBlock', 'quoteComponent'],
        },
        {
          name: 'media',
          title: 'Media',
          of: ['imageComponent', 'videoComponent'],
        },
        {
          name: 'interactive',
          title: 'Interaktiv',
          of: ['buttonComponent', 'linkComponent', 'accordionComponent', 'countdownComponent'],
        },
        {
          name: 'sections',
          title: 'Seksjoner',
          of: ['contentScrollContainer', 'artistScrollContainer', 'eventScrollContainer'],
        },
      ],
      views: [
        {
          name: 'grid',
        },
        {
          name: 'list',
        },
      ],
    },
  },
  of: [
    // === LAYOUT COMPONENTS ===
    {
      type: 'columnLayout',
      title: 'Responsiv Layout',
      icon: EllipsisHorizontalIcon,
    },
    {
      type: 'gridLayout',
      title: 'Grid Layout (Avansert)',
      icon: BlockContentIcon,
    },
    {
      type: 'spacer',
      title: 'Spacing/Avstand',
      icon: ExpandIcon,
    },

    // === CONTENT COMPONENTS (UTEN TITLE) ===
    {
      type: 'headingComponent',
      title: 'Overskrift (H2-H6)',
      icon: BlockContentIcon,
    },
    {
      type: 'portableTextBlock',
      title: 'Tekst',
      icon: TextIcon,
    },
    {
      type: 'quoteComponent',
      title: 'Sitat',
      icon: AddCommentIcon,
    },

    // === MEDIA COMPONENTS ===
    {
      type: 'imageComponent',
      title: 'Bilde',
      icon: ImageIcon,
    },
    {
      type: 'videoComponent',
      title: 'Video',
      icon: PlayIcon,
    },

    // === INTERACTIVE COMPONENTS ===
    {
      type: 'buttonComponent',
      title: 'Knapp',
      icon: BoltIcon,
    },
    {
      type: 'linkComponent',
      title: 'Lenke',
      icon: LinkIcon,
    },
    {
      type: 'accordionComponent',
      title: 'Sammenleggbar seksjon',
      icon: TiersIcon,
    },
    {
      type: 'countdownComponent',
      title: 'Nedtelling',
      icon: ClockIcon,
    },

    // === SECTION COMPONENTS ===
    {
      type: 'contentScrollContainer',
      title: 'Content Scroll Container',
      icon: EllipsisHorizontalIcon,
    },
    {
      type: 'artistScrollContainer',
      title: 'Artist Scroll Container',
      icon: DocumentIcon,
    },
    {
      type: 'eventScrollContainer',
      title: 'Event Scroll Container',
      icon: CalendarIcon,
    },
  ],
})
