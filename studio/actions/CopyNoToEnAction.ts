import {useClient} from 'sanity'
import type {DocumentActionComponent} from 'sanity'
import {CopyIcon} from '@sanity/icons'

export const CopyNoToEnAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2025-01-01' })

  return {
    label: 'Kopier 🇳🇴 → 🇬🇧 (kun tomme)',
    icon: CopyIcon,
    onHandle: async () => {
      const {id} = props
      const doc = await client.getDocument(id)
      if (!doc) return props.onComplete?.()

      const set: Record<string, any> = {}

      // Strings/tekst (kopier hvis EN mangler)
      if (!doc.excerpt_en && doc.excerpt_no) set.excerpt_en = doc.excerpt_no
      if (!doc.instrument_en && doc.instrument_no) set.instrument_en = doc.instrument_no
      if (!doc.imageAlt_en && doc.imageAlt_no) set.imageAlt_en = doc.imageAlt_no
      if (!doc.imageCaption_en && doc.imageCaption_no) set.imageCaption_en = doc.imageCaption_no

      // Page builder / Portable Text / arrays (kopier hvis EN mangler)
      const isEmptyArray = (v: any) => !Array.isArray(v) || v.length === 0
      if (isEmptyArray(doc.content_en) && Array.isArray(doc.content_no)) {
        // DYP KOPI uten å endre _key i markDefs/children
        // NB: Samme _key-verdier er helt OK siden det er i et annet felt.
        const cloned = JSON.parse(JSON.stringify(doc.content_no))
        set.content_en = cloned
      }

      if (Object.keys(set).length > 0) {
        await client.patch(id).set(set).commit({autoGenerateArrayKeys: true})
      }

      props.onComplete?.()
    },
  }
}

export default CopyNoToEnAction