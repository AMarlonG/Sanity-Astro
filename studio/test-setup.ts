import {vi} from 'vitest'

if (!globalThis.crypto) {
  const crypto = require('crypto')
  globalThis.crypto = crypto.webcrypto as Crypto
}

vi.mock('sanity/structure', () => ({
  structureTool: () => ({
    name: 'structure',
    title: 'Structure'
  })
}))

vi.mock('@sanity/vision', () => ({
  visionTool: () => ({
    name: 'vision',
    title: 'Vision'
  })
}))

vi.mock('@sanity/locale-nb-no', () => ({
  nbNOLocale: () => ({
    name: 'nb-NO',
    title: 'Norwegian Bokmål'
  })
}))