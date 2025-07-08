import {StructureBuilder} from 'sanity/desk'
import {
  CogIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  HomeIcon,
  EarthGlobeIcon,
  DocumentsIcon,
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Innhold')
    .items([
      // Nettsideinnstillinger
      S.listItem()
        .title('Nettsideinnstillinger')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      // Skillelinje
      S.divider(),

      // Nettsideinnhold
      S.listItem().title('Forsider').icon(EarthGlobeIcon).child(S.documentTypeList('homepages')),
      S.listItem().title('Faste sider').icon(DocumentsIcon).child(S.documentTypeList('pages')),
      S.listItem().title('Artikler').icon(DocumentTextIcon).child(S.documentTypeList('articles')),

      // Skillelinje
      S.divider(),

      // Artister & Arrangementer
      S.listItem().title('Arrangementer').icon(CalendarIcon).child(S.documentTypeList('events')),
      S.listItem().title('Artister').icon(UserIcon).child(S.documentTypeList('artists')),

      // Skillelinje
      S.divider(),

      // Sjangre & Spillesteder
      S.listItem().title('Spillesteder').icon(HomeIcon).child(S.documentTypeList('venues')),
      S.listItem()
        .title('Arrangementsdatoer')
        .icon(CalendarIcon)
        .child(S.documentTypeList('eventDates')),
      S.listItem().title('Sjangre').icon(TagIcon).child(S.documentTypeList('genres')),
    ])
