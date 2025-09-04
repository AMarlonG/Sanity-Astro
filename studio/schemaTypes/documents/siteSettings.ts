import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Nettsideinnstillinger',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'general',
      title: 'Generelle innstillinger',
      default: true,
    },
    {
      name: 'festival',
      title: 'Festivalinfo',
    },
    {
      name: 'image',
      title: 'Årets festivalbilde',
    },
    {
      name: 'contact',
      title: 'Kontaktinformasjon',
    },
    {
      name: 'social',
      title: 'Sosiale medier',
    },
    {
      name: 'sponsors',
      title: 'Sponsorer',
    },
    {
      name: 'newsletter',
      title: 'Nyhetsbrev',
    },
  ],
  fieldsets: [
    {
      name: 'yearAndDates',
      title: 'År og datoer',
      options: {columns: 2},
    },
    {
      name: 'addressInfo',
      title: 'Adresse',
      description: 'Lenke til Google Maps eller annen lokasjon',
    },
  ],
  fields: [
    defineField({
      name: 'festivalNumber',
      title: 'Festivalnummer',
      type: 'string',
      description: 'Hvilket nummer festivalen er (f.eks. 1, 2, 3 for første, andre, tredje festival)',
      group: 'festival',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Festivalår',
      type: 'string',
      initialValue: new Date().getFullYear().toString(),
      group: 'festival',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Startdato',
      type: 'reference',
      to: [{type: 'eventDate'}],
      description: 'Velg første dag av festivalen',
      group: 'festival',
      fieldset: 'yearAndDates',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Sluttdato',
      type: 'reference',
      to: [{type: 'eventDate'}],
      description: 'Velg siste dag av festivalen',
      group: 'festival',
      fieldset: 'yearAndDates',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'organizationName',
      title: 'Festivalens navn',
      type: 'string',
      group: 'general',
      description: 'Navnet på organisasjonen/festivalen',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logos',
      title: 'Logoer',
      type: 'array',
      group: 'general',
      description: 'Logoer for organisasjonen (hovedlogo, sekundær logo, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Logonavn',
              type: 'string',
              description: 'F.eks. "Hovedlogo", "Sekundær logo", "Hvit logo"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Logo',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Beskrivelse',
              type: 'text',
              rows: 2,
              description: 'Hvor og hvordan denne logoen skal brukes',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'image',
              description: 'description',
            },
            prepare({title, media, description}) {
              return {
                title: title || 'Uten navn',
                subtitle: description || 'Ingen beskrivelse',
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'general',
      description: 'Liten ikon som vises i nettleserens faneblad',
    }),
    defineField({
      name: 'email',
      title: 'E-post',
      type: 'email',
      description: 'Hoved e-postadresse for kontakt',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      description: 'Telefonnummer for kontakt',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Postadresse',
      type: 'string',
      description: 'F.eks. Storgata 3, 0150 Byen',
      group: 'contact',
      fieldset: 'addressInfo',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Lenke-URL',
      type: 'url',
      description: 'Lenke til kart eller nettside (f.eks. Google Maps)',
      group: 'contact',
      fieldset: 'addressInfo',
      validation: (Rule) => Rule.warning().custom((value, context) => {
        // Hvis adresse er fylt ut, må URL også fylles ut
        if (context.document?.address && !value) {
          return 'Lenke-URL bør fylles ut når adresse er definert'
        }
        return true
      }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Åpne i ny fane',
      type: 'boolean',
      description: 'Åpner lenken i en ny fane (anbefalt for eksterne lenker)',
      group: 'contact',
      fieldset: 'addressInfo',
      initialValue: true,
    }),
    defineField({
      name: 'socialMedia',
      title: 'Sosiale medier',
      type: 'array',
      group: 'social',
      description: 'Legg til de sosiale mediene du ønsker å vise',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Navn',
              type: 'string',
              description: 'F.eks. "Instagram", "Facebook", "LinkedIn"',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Lenke til profilen din',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              url: 'url',
            },
            prepare({title, url}) {
              return {
                title: title || 'Uten navn',
                subtitle: url || 'Ingen URL',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsorer',
      type: 'array',
      group: 'sponsors',
      description: 'Liste over sponsorer med logo og lenke',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Sponsornavn',
              type: 'string',
            }),
            defineField({
              name: 'logo',
              title: 'Sponsorlogo',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'url',
              title: 'Lenke til sponsor',
              type: 'url',
              description: 'URL til sponsor nettside',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
              url: 'url',
            },
            prepare({title, media, url}) {
              return {
                title: title || 'Uten navn',
                subtitle: url ? 'Har lenke' : 'Ingen lenke',
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'newsletterTitle',
      title: 'Tittel for nyhetsbrev',
      type: 'string',
      description: 'Tittel som vises på nyhetsbrev-signup skjema',
      group: 'newsletter',
      initialValue: 'Meld deg på nyhetsbrev',
    }),
    defineField({
      name: 'newsletterUrl',
      title: 'Lenke til påmeldingsskjema',
      type: 'url',
      description: 'Skjemaet finner du hos nyhetsbrevleverandør (f.eks. Make, Mailchimp)',
      group: 'newsletter',
    }),
    defineField({
      name: 'description',
      title: 'Festivalbeskrivelse',
      type: 'text',
      rows: 2,
      description: 'Kort beskrivelse av festivalen og årets tema',
      group: 'general',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Bilde',
      type: 'image',
      description: 'Last opp eller velg et bilde som representerer årets festival - brukes når sider deles på sosiale medier',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Festivalbilde må lastes opp'
        }
        return true
      }),
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'featuredImageCredit',
      title: 'Kreditering',
      type: 'string',
      description: 'Hvem som har tatt eller eier bildet (f.eks. "Foto: John Doe" eller "Kilde: Unsplash")',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Kreditering må fylles ut'
        }
        return true
      }),
    }),
    defineField({
      name: 'featuredImageAlt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beskriv bildet for tilgjengelighet og SEO',
      group: 'image',
      validation: (Rule) => Rule.warning().custom((value) => {
        if (!value) {
          return 'Alt-tekst må fylles ut'
        }
        return true
      }),
    }),
    defineField({
      name: 'featuredImageCaption',
      title: 'Bildetekst',
      type: 'string',
      description: 'Valgfri tekst som kan vises med bildet',
      group: 'image',
    }),
  ],
  preview: {
    select: {
      media: 'logo',
      year: 'festivalSettings.year',
      startDate: 'festivalSettings.startDate.date',
    },
    prepare({media, year, startDate}) {
      const formatDate = (date: string) => {
        return date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke satt'
      }
      return {
        title: 'Nettsideinnstillinger',
        subtitle: `Festival ${year || new Date().getFullYear()} (${formatDate(startDate)})`,
        media,
      }
    },
  },
})
