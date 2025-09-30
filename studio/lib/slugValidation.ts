import type {SlugValidationContext} from 'sanity'

/**
 * Creates a unique slug validation function for a specific document type
 * @param documentType - The document type to check for unique slugs
 * @returns Validation function that checks for slug uniqueness
 */
export function createUniqueSlugValidation(documentType: string) {
  return async (slug: {current: string} | undefined, context: SlugValidationContext) => {
    if (!slug?.current) return true

    const {document, getClient} = context
    const client = getClient({apiVersion: '2023-05-03'})
    
    // Get the current document ID, handling both published and draft documents
    const currentDocId = document?._id?.replace(/^drafts\./, '')
    
    // Query for documents with the same slug, excluding the current document (both published and draft versions)
    const query = `*[_type == $type && slug.current == $slug && _id != $id && _id != $draftId][0]`
    const params = {
      type: documentType,
      slug: slug.current,
      id: currentDocId,
      draftId: `drafts.${currentDocId}`
    }
    
    try {
      const existing = await client.fetch(query, params)
      return existing ? `Slug "${slug.current}" is already in use. Please choose a different one.` : true
    } catch (error) {
      console.error('Error validating slug uniqueness:', error)
      // Return true to allow saving if validation fails (graceful degradation)
      return true
    }
  }
}

/**
 * Pre-configured validation functions for common document types
 */
export const venueSlugValidation = createUniqueSlugValidation('venue')
export const artistSlugValidation = createUniqueSlugValidation('artist')
export const eventSlugValidation = createUniqueSlugValidation('event')