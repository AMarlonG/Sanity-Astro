import {homepagesType} from './documents/homepages'
import {artistsType} from './documents/artists'
import {genresType} from './documents/genres'
import {siteSettingsType} from './documents/siteSettings'
import {eventsType} from './documents/events'
import {venuesType} from './documents/venues'
import eventDates from './documents/eventDates'
import pages from './documents/pages'
import articles from './documents/articles'

// Importer komponenter
import * as components from './components'
// Importer seksjoner
import * as sections from './sections'

export const schemaTypes = [
  homepagesType,
  artistsType,
  genresType,
  siteSettingsType,
  eventsType,
  venuesType,
  eventDates,
  pages,
  articles,
  // Komponenter - sørg for at alle er registrert
  components.titleType,
  components.quotesType,
  components.headingsType,
  components.portableTextType,
  components.portableTextBlockType,
  components.imageComponentType,
  components.videoComponentType,
  components.buttonComponentType,
  components.linkComponentType,
  components.accordionComponentType,
  components.pageBuilderType,
  components.columnLayoutType,
  // Seksjoner
  sections.horizontalScrollContainerType,
]
