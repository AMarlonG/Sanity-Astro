import {homepage} from './documents/homepage'
import {programPage} from './documents/programPage'
import {artistPage} from './documents/artistPage'
import {artist} from './documents/artist'
import {genre} from './documents/genres'
import {composer} from './documents/composer'
import {siteSettings} from './documents/siteSettings'
import {event} from './documents/event'
import {venue} from './documents/venue'
import {eventDate} from './documents/eventDate'
import {page} from './documents/page'
import {article} from './documents/article'

// Importer komponenter
import * as components from './components'
// Importer objekter
import {socialMediaType} from './objects/socialMediaFields'

export const schemaTypes = [
  homepage,
  programPage,
  artistPage,
  artist,
  genre,
  composer,
  siteSettings,
  event,
  venue,
  eventDate,
  page,
  article,
  // Objekter
  socialMediaType,
  // Komponenter - sørg for at alle er registrert
  components.title,
  components.quoteComponent,
  components.headingComponent,
  components.portableText,
  components.portableTextBlock,
  components.imageComponent,
  components.videoComponent,
  components.buttonComponent,
  components.linkComponent,
  components.accordionComponent,
  components.countdownComponent,
  components.pageBuilder,
  components.pageBuilderWithoutTitle,
  components.columnLayout,
  components.gridLayout,
  components.spacer,
  // Seksjoner
  components.contentScrollContainer,
  components.artistScrollContainer,
  components.eventScrollContainer,
]
