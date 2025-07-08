import {defineField, defineType} from 'sanity'
import {
  DocumentIcon,
  ImageIcon,
  PlayIcon,
  LinkIcon,
  TiersIcon,
  DocumentTextIcon,
  TextIcon,
  AddCommentIcon,
  BlockContentIcon,
  BoltIcon,
} from '@sanity/icons'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Sideinnhold',
  type: 'array',
  icon: DocumentIcon,
  description: 'Bygg siden med komponenter og innhold',
  of: [
    // Bilde-komponent
    {
      type: 'imageComponent',
      title: 'Bilde',
      icon: ImageIcon,
      preview: {
        select: {
          title: 'alt',
          subtitle: 'caption',
          media: 'image',
        },
        prepare({title, subtitle, media}) {
          return {
            title: title || 'Bilde uten alt-tekst',
            subtitle: subtitle || 'Ingen bildetekst',
            media: media || ImageIcon,
          }
        },
      },
    },
    // Video-komponent
    {
      type: 'videoComponent',
      title: 'Video',
      icon: PlayIcon,
      preview: {
        select: {
          title: 'title',
          subtitle: 'url',
          media: 'thumbnail',
        },
        prepare({title, subtitle, media}) {
          return {
            title: title || 'Video uten tittel',
            subtitle: subtitle || 'Ingen URL',
            media: media || PlayIcon,
          }
        },
      },
    },
    // Knapp-komponent
    {
      type: 'buttonComponent',
      title: 'Knapp',
      icon: BoltIcon,
      preview: {
        select: {
          title: 'text',
          style: 'style',
          size: 'size',
          action: 'action',
        },
        prepare({title, style, size, action}) {
          return {
            title: title || 'Knapp uten tekst',
            subtitle: `${style} • ${size} • ${action || 'ingen handling'}`,
            media: BoltIcon,
          }
        },
      },
    },
    // Lenke-komponent
    {
      type: 'linkComponent',
      title: 'Lenke',
      icon: LinkIcon,
      preview: {
        select: {
          title: 'text',
          subtitle: 'url',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Lenke uten tekst',
            subtitle: subtitle || 'Ingen URL',
            media: LinkIcon,
          }
        },
      },
    },
    // Accordion-komponent
    {
      type: 'accordionComponent',
      title: 'Sammenleggbar seksjon',
      icon: TiersIcon,
      preview: {
        select: {
          title: 'title',
          subtitle: 'content',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Accordion uten tittel',
            subtitle: subtitle ? `${subtitle.substring(0, 50)}...` : 'Ingen innhold',
            media: TiersIcon,
          }
        },
      },
    },
    // Headings-komponent
    {
      type: 'headings',
      title: 'Overskrifter',
      icon: BlockContentIcon,
      preview: {
        select: {
          level: 'level',
          text: 'text',
          id: 'id',
        },
        prepare({level, text, id}) {
          const displayLevel = level ? level.toUpperCase() : 'H?'
          const displayText = text || 'Ingen overskriftstekst'
          const displayId = id?.current ? `#${id.current}` : ''

          return {
            title: `${displayLevel}: ${displayText}`,
            subtitle: displayId,
            media: BlockContentIcon,
          }
        },
      },
    },
    // Quotes-komponent
    {
      type: 'quotes',
      title: 'Sitat',
      icon: AddCommentIcon,
      preview: {
        select: {
          title: 'quote',
          subtitle: 'author',
        },
        prepare({title, subtitle}) {
          return {
            title: title ? `${title.substring(0, 50)}...` : 'Ingen sitat',
            subtitle: subtitle || 'Ingen forfatter',
            media: AddCommentIcon,
          }
        },
      },
    },
    // PortableText-komponent (wrapper)
    {
      type: 'portableTextBlock',
      title: 'Legg til tekst',
      icon: TextIcon,
      preview: {
        select: {
          title: 'title',
          content: 'content',
        },
        prepare({title, content}) {
          // Hent første tekst fra portable text
          const firstText = content?.[0]?.children?.[0]?.text || ''
          const displayTitle = title || 'Legg til tekst'
          const displaySubtitle = firstText ? `${firstText.substring(0, 50)}...` : 'Ingen innhold'

          return {
            title: displayTitle,
            subtitle: displaySubtitle,
            media: TextIcon,
          }
        },
      },
    },
  ],
  // Fjernet layout: 'grid' for å få vertikal layout
})
