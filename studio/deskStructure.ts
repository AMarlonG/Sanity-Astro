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
  ComposeIcon,
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

      // Sideinnhold
      S.listItem().title('Forsider').icon(EarthGlobeIcon).child(S.documentTypeList('homepage')),
      S.listItem().title('Faste sider').icon(DocumentsIcon).child(S.documentTypeList('page')),

      // Skillelinje
      S.divider(),

      // Innholdstyper
      S.listItem().title('Arrangementer').icon(CalendarIcon).child(S.documentTypeList('event')),
      S.listItem().title('Artister').icon(UserIcon).child(S.documentTypeList('artist')),
      S.listItem().title('Artikler').icon(DocumentTextIcon).child(S.documentTypeList('article')),

      // Skillelinje
      S.divider(),

      // Sjangre & Spillesteder
      S.listItem().title('Spillesteder').icon(HomeIcon).child(S.documentTypeList('venue')),
      S.listItem()
        .title('Festivaldatoer')
        .icon(CalendarIcon)
        .child(S.documentTypeList('eventDate')),
      S.listItem().title('Sjangre').icon(TagIcon).child(S.documentTypeList('genre')),
      S.listItem().title('Komponister').icon(ComposeIcon).child(S.documentTypeList('composer')),
    ])