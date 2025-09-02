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
  ExpandIcon,
} from '@sanity/icons'

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Sideinnhold',
  type: 'array',
  icon: DocumentIcon,
  description: 'Bygg siden med komponenter og innhold',
  groups: [
    { name: 'layout', title: 'Layout' },
    { name: 'content', title: 'Innhold' },
    { name: 'media', title: 'Media' },
    { name: 'interactive', title: 'Interaktiv' },
    { name: 'sections', title: 'Seksjoner' },
  ],
  of: [
    // === LAYOUT COMPONENTS ===
    {
      type: 'columnLayout',
      title: 'Responsiv Layout',
      icon: EllipsisHorizontalIcon,
      group: 'layout',
      preview: {
        select: {
          layoutType: 'layoutType',
          desktopColumns: 'desktopColumns',
          count: 'items.length',
          containerWidth: 'containerWidth',
        },
        prepare({layoutType, desktopColumns, count, containerWidth}) {
          const layoutName = 
            layoutType === 'columns' ? `${desktopColumns || '2'} kolonne(r)` :
            layoutType === 'flexbox' ? 'Flexbox' :
            'Stack'
          
          return {
            title: `${layoutName} Layout`,
            subtitle: `${count || 0} komponenter • ${containerWidth || 'full'} bredde`,
            media: EllipsisHorizontalIcon,
          }
        },
      },
    },
    {
      type: 'gridLayout',
      title: 'Grid Layout (Avansert)',
      icon: BlockContentIcon,
      group: 'layout',
      preview: {
        select: {
          gridTemplate: 'gridTemplate',
          itemCount: 'gridItems.length',
        },
        prepare({gridTemplate, itemCount}) {
          const templateName = 
            gridTemplate === 'hero' ? 'Hero Layout' :
            gridTemplate === 'magazine' ? 'Magazine Layout' :
            gridTemplate === 'masonry' ? 'Masonry Layout' :
            'Custom Grid'
          
          return {
            title: templateName,
            subtitle: `${itemCount || 0} grid items`,
            media: BlockContentIcon,
          }
        },
      },
    },
    {
      type: 'spacer',
      title: 'Spacing/Avstand',
      icon: ExpandIcon,
      group: 'layout',
      preview: {
        select: {
          type: 'type',
          desktopSize: 'size.desktop',
          showDivider: 'showDivider',
        },
        prepare({type, desktopSize, showDivider}) {
          const typeDisplay = 
            type === 'vertical' ? 'Vertikal' :
            type === 'horizontal' ? 'Horisontal' :
            'Seksjon'
          
          const dividerDisplay = showDivider ? ' • med skillelinje' : ''
          
          return {
            title: `${typeDisplay} Avstand`,
            subtitle: `${desktopSize || 'medium'} størrelse${dividerDisplay}`,
            media: ExpandIcon,
          }
        },
      },
    },

    // === CONTENT COMPONENTS ===
    {
      type: 'title',
      title: 'Tittel (H1/H2)',
      icon: DocumentTextIcon,
      group: 'content',
      preview: {
        select: {
          title: 'mainTitle',
          subtitle: 'subtitle',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Untitled',
            subtitle: subtitle ? `Subtitle: ${subtitle}` : 'No subtitle',
            media: DocumentTextIcon,
          }
        },
      },
    },
    {
      type: 'headingComponent',
      title: 'Overskrift (H2-H6)',
      icon: BlockContentIcon,
      group: 'content',
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
    {
      type: 'portableTextBlock',
      title: 'Tekst (Rich Text)',
      icon: TextIcon,
      group: 'content',
      preview: {
        select: {
          title: 'title',
          content: 'content',
        },
        prepare({title, content}) {
          const firstText = content?.[0]?.children?.[0]?.text || ''
          const displayTitle = title || 'Tekst'
          const displaySubtitle = firstText ? `${firstText.substring(0, 50)}...` : 'Ingen innhold'

          return {
            title: displayTitle,
            subtitle: displaySubtitle,
            media: TextIcon,
          }
        },
      },
    },
    {
      type: 'quoteComponent',
      title: 'Sitat',
      icon: AddCommentIcon,
      group: 'content',
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

    // === MEDIA COMPONENTS ===
    {
      type: 'imageComponent',
      title: 'Bilde',
      icon: ImageIcon,
      group: 'media',
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
    {
      type: 'videoComponent',
      title: 'Video',
      icon: PlayIcon,
      group: 'media',
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

    // === INTERACTIVE COMPONENTS ===
    {
      type: 'buttonComponent',
      title: 'Knapp',
      icon: BoltIcon,
      group: 'interactive',
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
    {
      type: 'linkComponent',
      title: 'Lenke',
      icon: LinkIcon,
      group: 'interactive',
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
    {
      type: 'accordionComponent',
      title: 'Sammenleggbar seksjon',
      icon: TiersIcon,
      group: 'interactive',
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

    // === SECTION COMPONENTS ===
    {
      type: 'contentScrollContainer',
      title: 'Content Scroll Container',
      icon: EllipsisHorizontalIcon,
      group: 'sections',
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
    {
      type: 'artistScrollContainer',
      title: 'Artist Scroll Container',
      icon: DocumentIcon,
      group: 'sections',
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
    {
      type: 'eventScrollContainer',
      title: 'Event Scroll Container',
      icon: CalendarIcon,
      group: 'sections',
      preview: {
        select: {
          title: 'title',
          items: 'items',
          cardFormat: 'cardFormat',
        },
        prepare({title, items, cardFormat}) {
          const eventCount = items?.length || 0
          return {
            title: title || 'Event Scroll Container',
            subtitle: `${eventCount} arrangementer • ${cardFormat}`,
            media: CalendarIcon,
          }
        },
      },
    },
  ],
})