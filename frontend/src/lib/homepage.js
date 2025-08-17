import { sanityClient } from 'sanity:client';

export async function getActiveHomepage() {
  const now = new Date().toISOString();

  // Først, prøv å få en planlagt forside som er aktiv nå
  try {
    const scheduledHomepage = await sanityClient.fetch(
      `
      *[_type == "homepage" && 
        scheduledPeriod.startDate <= $now && 
        scheduledPeriod.endDate >= $now
      ] | order(scheduledPeriod.startDate desc)[0]{
        _id,
        title,
        content[]{
          _key,
          _type,
          // PortableText
          content,
          // HeadingComponent
          level,
          text,
          id,
          // Image
          image,
          alt,
          caption,
          // Video
          url,
          title,
          thumbnail,
          // Button
          text,
          style,
          size,
          action,
          // Link
          openInNewTab,
          // Quote
          quote,
          author,
          // Accordion
          // Content Scroll Container
          items,
          spacing,
          // Artist Scroll Container
          cardFormat,
          // Event Scroll Container
          events
        },
        isDefault,
        scheduledPeriod
      }
    `,
      { now }
    );

    if (scheduledHomepage) {
      return scheduledHomepage;
    }
  } catch (error) {
    console.error('Error fetching scheduled homepage:', error);
  }

  // Ellers, bruk standard forsiden
  const defaultHomepage = await sanityClient.fetch(`
    *[_type == "homepage" && isDefault == true][0]{
      _id,
      title,
      content[]{
        _key,
        _type,
        // PortableText
        content,
        // HeadingComponent
        level,
        text,
        id,
        // Image
        image,
        alt,
        caption,
        // Video
        url,
        title,
        thumbnail,
        // Button
        text,
        style,
        size,
        action,
        // Link
        openInNewTab,
        // Quote
        quote,
        author,
        // Accordion
        // Content Scroll Container
        items,
        spacing,
        // Artist Scroll Container
        cardFormat,
        // Event Scroll Container
        events
      },
      isDefault,
      scheduledPeriod
    }
  `);

  return defaultHomepage;
}
