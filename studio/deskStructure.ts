import {StructureBuilder} from 'sanity/desk'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Innhold')
    .items([
      // Nettsideinnstillinger
      S.listItem()
        .title('Nettsideinnstillinger')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      // Skillelinje
      S.divider(),

      // Nettsideinnhold gruppe
      S.listItem()
        .title('Nettsideinnhold')
        .id('website-content-group')
        .child(
          S.list()
            .title('Nettsideinnhold')
            .items([
              S.listItem().title('Forsider').child(S.documentTypeList('homepages')),
              S.listItem().title('Faste sider').child(S.documentTypeList('pages')),
              S.listItem().title('Artikler').child(S.documentTypeList('articles')),
            ]),
        ),

      // Skillelinje
      S.divider(),

      // Alle andre dokumenttyper som vanlige lister (ekskluderer nettsideinnhold)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['siteSettings', 'homepages', 'pages', 'articles'].includes(listItem.getId() as string),
      ),
    ])
