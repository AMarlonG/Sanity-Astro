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
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'festivalSettings',
      title: 'Festivaltidspunkt',
      type: 'object',
      group: 'festival',
      description: 'Festivalens årstall og periode',
      fields: [
        defineField({
          name: 'year',
          title: 'Festivalår',
          type: 'number',
          initialValue: new Date().getFullYear(),
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'startDate',
          title: 'Startdato',
          type: 'date',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'endDate',
          title: 'Sluttdato',
          type: 'date',
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          year: 'year',
          startDate: 'startDate',
          endDate: 'endDate',
        },
        prepare({year, startDate, endDate}) {
          const formatDate = (date: string) => {
            return date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke satt'
          }
          return {
            title: `Festival ${year || new Date().getFullYear()}`,
            subtitle: `${formatDate(startDate)} → ${formatDate(endDate)}`,
          }
        },
      },
    }),
    defineField({
      name: 'festivalNumber',
      title: 'Festivalnummer',
      type: 'number',
      group: 'festival',
      description:
        'Hvilket nummer festivalen er (f.eks. 1, 2, 3 for første, andre, tredje festival)',
      validation: (rule) => rule.required().positive().integer(),
    }),

    defineField({
      name: 'organizationName',
      title: 'Organisasjonsnavn',
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
      name: 'contact',
      title: 'Kontaktinformasjon',
      type: 'object',
      group: 'contact',
      description: 'Kontaktinformasjon for organisasjonen',
      fields: [
        defineField({
          name: 'email',
          title: 'E-post',
          type: 'email',
          description: 'Hoved e-postadresse for kontakt',
        }),
        defineField({
          name: 'phone',
          title: 'Telefon',
          type: 'string',
          description: 'Telefonnummer for kontakt',
        }),
        defineField({
          name: 'address',
          title: 'Adresse',
          type: 'text',
          rows: 2,
          description: 'Fysisk adresse til organisasjonen',
        }),
      ],
    }),
    defineField({
      name: 'socialMedia',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'instagram',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          type: 'url',
        }),
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
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Sponsorlogo',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
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
      name: 'newsletter',
      title: 'Nyhetsbrev',
      type: 'object',
      group: 'newsletter',
      description: 'Innstillinger for nyhetsbrev og e-post',
      fields: [
        defineField({
          name: 'title',
          title: 'Tittel for nyhetsbrev',
          type: 'string',
          description: 'Tittel som vises på nyhetsbrev-signup skjema',
          initialValue: 'Meld deg på nyhetsbrev',
        }),
        defineField({
          name: 'description',
          title: 'Beskrivelse',
          type: 'text',
          rows: 2,
          description: 'Kort beskrivelse av hva nyhetsbrevet inneholder',
        }),
        defineField({
          name: 'placeholder',
          title: 'Placeholder tekst',
          type: 'string',
          description: 'Tekst som vises i e-post input feltet',
          initialValue: 'Din e-postadresse',
        }),
        defineField({
          name: 'buttonText',
          title: 'Knappetekst',
          type: 'string',
          description: 'Tekst på "meld på" knappen',
          initialValue: 'Meld på',
        }),
        defineField({
          name: 'successMessage',
          title: 'Suksessmelding',
          type: 'text',
          rows: 2,
          description: 'Melding som vises når noen melder seg på',
          initialValue: 'Takk! Du er nå meldt på nyhetsbrevet.',
        }),
        defineField({
          name: 'privacyText',
          title: 'Personvern tekst',
          type: 'text',
          rows: 2,
          description: 'Tekst om personvern og samtykke',
          initialValue: 'Jeg godtar at min e-postadresse brukes til å sende meg nyhetsbrev.',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'defaultTitle',
          type: 'string',
        }),
        defineField({
          name: 'defaultDescription',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'defaultImage',
          type: 'image',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      media: 'logo',
      year: 'festivalSettings.year',
      startDate: 'festivalSettings.startDate',
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
