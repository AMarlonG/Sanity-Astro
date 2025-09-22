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
  UsersIcon,
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

      // Fast innhold
      S.divider().title('FAST INNHOLD'),

      S.listItem().title('Forsider').icon(EarthGlobeIcon).child(S.documentTypeList('homepage')),
      S.listItem()
        .title('Programside')
        .icon(CalendarIcon)
        .child(S.document().schemaType('programPage').documentId('programPage')),
      S.listItem()
        .title('Artistside')
        .icon(UsersIcon)
        .child(S.document().schemaType('artistPage').documentId('artistPage')),
      S.listItem().title('Faste sider').icon(DocumentsIcon).child(S.documentTypeList('page')),

      // Festivalinnhold
      S.divider().title('FESTIVALINNHOLD'),

      S.listItem()
        .title('Arrangementer')
        .icon(CalendarIcon)
        .child(
          S.documentTypeList('event')
            .defaultOrdering([
              {field: 'eventDate.date', direction: 'asc'},
              {field: 'eventTime.startTime', direction: 'asc'}
            ])
        ),
      S.listItem()
        .title('Artister')
        .icon(UserIcon)
        .child(
          S.documentTypeList('artist')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
        ),
      S.listItem().title('Artikler').icon(DocumentTextIcon).child(S.documentTypeList('article')),

      // Referansedata
      S.divider().title('REFERANSEDATA'),
      S.listItem()
        .title('Festivaldatoer')
        .icon(CalendarIcon)
        .child(
          S.documentTypeList('eventDate')
            .defaultOrdering([{field: 'date', direction: 'asc'}])
        ),
      S.listItem()
        .title('Spillesteder')
        .icon(HomeIcon)
        .child(
          S.documentTypeList('venue')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
        ),
      S.listItem()
        .title('Sjangre')
        .icon(TagIcon)
        .child(
          S.documentTypeList('genre')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
        ),
      S.listItem()
        .title('Komponister')
        .icon(ComposeIcon)
        .child(
          S.documentTypeList('composer')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
        ),
    ])