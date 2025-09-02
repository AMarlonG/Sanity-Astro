import {homepage} from './documents/homepage'
import {artist} from './documents/artist'
import {genre} from './documents/genres'
import {siteSettings} from './documents/siteSettings'
import {event} from './documents/event'
import {venue} from './documents/venue'
import eventDate from './documents/eventDate'
import page from './documents/page'
import {article} from './documents/article'

// Importer komponenter
import * as components from './components'
// Importer seksjoner
import * as sections from './sections'
// Importer objekter
import {socialMediaType} from './objects/socialMediaFields'

export const schemaTypes = [
  homepage,
  artist,
  genre,
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
  components.pageBuilder,
  components.columnLayout,
  // Seksjoner
  sections.contentScrollContainer,
  sections.artistScrollContainer,
  sections.eventScrollContainer,
]
