/**
 * Minimal Astro/Sanity type augmentations to align with shared schema types.
 */

import type {SanityClient} from '@sanity/client'
import type {
  Event,
  Artist,
  Article,
  Homepage,
} from '../../shared/types/sanity'

declare global {
  namespace Astro {
    interface Props {
      event?: Event
      artist?: Artist
      article?: Article
      homepage?: Homepage
      content_no?: any[]
      content_en?: any[]
    }
  }
}

declare module 'sanity:client' {
  interface SanityClientConfig {
    projectId: string
    dataset: string
    apiVersion: string
    useCdn?: boolean
    token?: string
    perspective?: 'published' | 'drafts'
    stega?: boolean
  }

  const sanityClient: SanityClient
  export {sanityClient}
}
