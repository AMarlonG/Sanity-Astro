import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'i952bgb1',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
})

const slug = 'joseph-haydn-arets-komponist'

const query = '*[_type == "article" && $slug in [slug_no.current, slug_en.current, slug.current]][0]{ _id, title_no, slug_no, slug_en, slug, "computed_slug": coalesce(slug_no.current, slug_en.current, slug.current) }'

console.log('Testing query:', query)
console.log('With slug:', slug)

client.fetch(query, { slug }).then(result => {
  console.log('\nQuery result:', JSON.stringify(result, null, 2))
  if (!result) {
    console.log('\n❌ No article found!')
  } else {
    console.log('\n✓ Article found successfully!')
  }
}).catch(err => {
  console.error('\nQuery error:', err.message)
})
