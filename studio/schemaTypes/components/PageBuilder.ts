import {defineField, defineType} from 'sanity'
import {
  DocumentIcon,
  ImageIcon,
  PlayIcon,
  LinkIcon,
  TiersIcon,
  DocumentTextIcon,
  TextIcon,
  EllipsisHorizontalIcon,
  AddCommentIcon,
  BlockContentIcon,
  BoltIcon,
  CalendarIcon,
} from '@sanity/icons'

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Sideinnhold',
  type: 'array',
  icon: DocumentIcon,
  description: 'Bygg siden med komponenter og innhold',
  of: [
    // Kolonnelayout-komponent
    {
      type: 'columnLayout',
      title: 'Kolonnelayout',
      icon: EllipsisHorizontalIcon,
      preview: {
        select: {
          cols: 'columns',
          count: 'items.length',
        },
        prepare({cols, count}) {
          return {
            title: `Kolonnelayout: ${cols} kolonne${cols === '1' ? '' : 'r'}`,
            subtitle: `${count || 0} element(er)`,
            media: EllipsisHorizontalIcon,
          }
        },
      },
    },
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
      type: 'headingComponent',
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
    // Sitat-komponent
    {
      type: 'quoteComponent',
      title: 'Legg til sitat',
      icon: AddCommentIcon,
      preview: {
        select: {
          quote: 'quote',
          author: 'author',
        },
        prepare({quote, author}) {
          return {
            title: quote || 'Sitat',
            subtitle: author ? `– ${author}` : '',
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
    // Content Scroll Container
    {
      type: 'contentScrollContainer',
      title: 'Content Scroll Container',
      icon: EllipsisHorizontalIcon,
      preview: {
        select: {
          title: 'title',
          items: 'items',
          spacing: 'spacing',
        },
        prepare({title, items, spacing}) {
          const itemCount = items?.length || 0
          return {
            title: title || 'Content Scroll Container',
            subtitle: `${itemCount} elementer • ${spacing || 'medium'} avstand`,
            media: EllipsisHorizontalIcon,
          }
        },
      },
    },
    // Artist Scroll Container
    {
      type: 'artistScrollContainer',
      title: 'Artist Scroll Container',
      icon: DocumentIcon,
      preview: {
        select: {
          title: 'title',
          items: 'items',
          cardFormat: 'cardFormat',
        },
        prepare({title, items, cardFormat}) {
          const itemCount = items?.length || 0
          return {
            title: title || 'Artist Scroll Container',
            subtitle: `${itemCount} artister • ${cardFormat}`,
            media: DocumentIcon,
          }
        },
      },
    },
    // Event Scroll Container
    {
      type: 'eventScrollContainer',
      title: 'Event Scroll Container',
      icon: CalendarIcon,
      preview: {
        select: {
          title: 'title',
          events: 'events',
          cardFormat: 'cardFormat',
        },
        prepare({title, events, cardFormat}) {
          const eventCount = events?.length || 0
          return {
            title: title || 'Event Scroll Container',
            subtitle: `${eventCount} arrangementer • ${cardFormat}`,
            media: CalendarIcon,
          }
        },
      },
    },
  ],
  // Fjernet layout: 'grid' for å få vertikal layout
})
