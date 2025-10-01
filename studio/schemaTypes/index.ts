import {homepage} from './documents/homepage'
import {programPage} from './documents/programPage'
import {artistPage} from './documents/artistPage'
import {artist} from './documents/artist'
import {composer} from './documents/composer'
import {siteSettings} from './documents/siteSettings'
import {event} from './documents/event'
import {venue} from './documents/venue'
import {eventDate} from './documents/eventDate'
import {page} from './documents/page'
import {article} from './documents/article'
import {error404} from './documents/error404'
import {error500} from './documents/error500'

// Importer komponenter
import * as components from './components'
// Importer objekter
import {seoType} from './objects/seoFields'

export const schemaTypes = [
  homepage,
  programPage,
  artistPage,
  artist,
  composer,
  siteSettings,
  event,
  venue,
  eventDate,
  page,
  article,
  error404,
  error500,
  // Objekter
  seoType,
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
