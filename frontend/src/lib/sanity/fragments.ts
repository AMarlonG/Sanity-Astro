/**
 * GROQ query fragments for all component types
 * This centralizes all component-specific data requirements
 */

// Basic component fields that all components need
const BASE_COMPONENT_FIELDS = `
  _key,
  _type
`;

// Content components
export const CONTENT_FRAGMENTS = {
  portableTextBlock: `
    _type == "portableTextBlock" => {
      ${BASE_COMPONENT_FIELDS},
      content
    }
  `,

  headingComponent: `
    _type == "headingComponent" => {
      ${BASE_COMPONENT_FIELDS},
      text,
      level,
      style
    }
  `,

  imageComponent: `
    _type == "imageComponent" => {
      ${BASE_COMPONENT_FIELDS},
      image{
        asset->{
          _id,
          url,
          metadata
        },
        alt,
        caption
      },
      aspectRatio,
      display
    }
  `,

  videoComponent: `
    _type == "videoComponent" => {
      ${BASE_COMPONENT_FIELDS},
      videoType,
      youtubeUrl,
      vimeoUrl,
      source,
      aspectRatio,
      autoplay,
      controls,
      loop,
      muted
    }
  `,

  quoteComponent: `
    _type == "quoteComponent" => {
      ${BASE_COMPONENT_FIELDS},
      quote,
      author,
      cite,
      style
    }
  `
};

// Interactive components
export const INTERACTIVE_FRAGMENTS = {
  buttonComponent: `
    _type == "buttonComponent" => {
      ${BASE_COMPONENT_FIELDS},
      text,
      url,
      style,
      size,
      icon,
      iconPosition,
      fullWidth,
      openInNewTab
    }
  `,

  linkComponent: `
    _type == "linkComponent" => {
      ${BASE_COMPONENT_FIELDS},
      text,
      linkType,
      anchorId,
      internalLink->{
        _id,
        _type,
        "slug": {
          "current": coalesce(slug.current, slug_no.current, slug_en.current)
        },
        title
      },
      url,
      email,
      phone,
      openInNewTab,
      accessibility
    }
  `,

  accordionComponent: `
    _type == "accordionComponent" => {
      ${BASE_COMPONENT_FIELDS},
      title,
      description,
      panels[]{
        title,
        content
      },
      accessibility
    }
  `,

  countdownComponent: `
    _type == "countdownComponent" => {
      ${BASE_COMPONENT_FIELDS},
      title,
      targetEvent->{
        _id,
        title,
        eventDate->{
          date
        },
        eventTime
      },
      style,
      completedMessage,
      hideWhenComplete
    }
  `
};

// Layout components
export const LAYOUT_FRAGMENTS = {
  columnLayout: `
    _type == "columnLayout" => {
      ${BASE_COMPONENT_FIELDS},
      layoutType,
      desktopColumns,
      tabletColumns,
      mobileColumns,
      flexDirection,
      flexWrap,
      gap,
      alignment,
      containerWidth,
      items[]{
        ${BASE_COMPONENT_FIELDS},
        // Recursively include all content types for nested items
        ...
      }
    }
  `,

  gridLayout: `
    _type == "gridLayout" => {
      ${BASE_COMPONENT_FIELDS},
      gridTemplate,
      gridAreas,
      gridItems[]{
        component[]{
          ${BASE_COMPONENT_FIELDS},
          ...
        },
        gridArea,
        span
      },
      responsiveGrid,
      gap
    }
  `,

  spacer: `
    _type == "spacer" => {
      ${BASE_COMPONENT_FIELDS},
      type,
      size,
      showDivider,
      dividerStyle
    }
  `
};

// Section components (scroll containers)
export const SECTION_FRAGMENTS = {
  contentScrollContainer: `
    _type == "contentScrollContainer" => {
      ${BASE_COMPONENT_FIELDS},
      title,
      items[]{
        _id,
        title,
        slug,
        image{
          asset->{url},
          alt
        }
      },
      cardFormat,
      aspectRatio,
      showScrollbar
    }
  `,

  artistScrollContainer: `
    _type == "artistScrollContainer" => {
      ${BASE_COMPONENT_FIELDS},
      title,
      items[]{
        _id,
        name,
        slug,
        image{
          asset->{url},
          alt
        },
        description
      },
      cardFormat,
      aspectRatio,
      showScrollbar
    }
  `,

  eventScrollContainer: `
    _type == "eventScrollContainer" => {
      ${BASE_COMPONENT_FIELDS},
      title,
      items[]{
        _id,
        title,
        slug,
        eventDate->{date},
        eventTime,
        venue->{name},
        artist[]->{name},
        image{
          asset->{url},
          alt
        }
      },
      cardFormat,
      aspectRatio,
      showScrollbar,
      showDate,
      showTime,
      showVenue,
      showArtists,
      sortBy
    }
  `
};

// Combine all fragments
export const ALL_COMPONENT_FRAGMENTS = {
  ...CONTENT_FRAGMENTS,
  ...INTERACTIVE_FRAGMENTS,
  ...LAYOUT_FRAGMENTS,
  ...SECTION_FRAGMENTS
};

// Create a single content query with all component types
export const CONTENT_QUERY = `
  content[]{
    ${BASE_COMPONENT_FIELDS},
    ${Object.values(ALL_COMPONENT_FRAGMENTS).join(',\n')}
  }
`;

// Helper to get specific fragment by type
export function getComponentFragment(type: string): string {
  return ALL_COMPONENT_FRAGMENTS[type as keyof typeof ALL_COMPONENT_FRAGMENTS] || `
    _type == "${type}" => {
      ${BASE_COMPONENT_FIELDS},
      ...
    }
  `;
}
