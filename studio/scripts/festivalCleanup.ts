import {getCliClient} from 'sanity/cli'

/**
 * Script for post-festival cleanup - deletes all festival content
 * Run with: sanity exec scripts/festivalCleanup.ts --with-user-token
 */

const client = getCliClient()

// Document types to clean up after festival
const FESTIVAL_DOCUMENT_TYPES = [
  'event',
  'artist',
  'venue',
  'eventDate',
  'article', // Articles about the festival
]

async function deleteDocumentsByType(docType: string) {
  console.log(`🗑️  Deleting all documents of type: ${docType}`)
  
  try {
    // First, get all documents of this type
    const documents = await client.fetch(`*[_type == "${docType}"][0...100]`)
    
    if (documents.length === 0) {
      console.log(`   ✅ No ${docType} documents found`)
      return
    }

    console.log(`   📊 Found ${documents.length} ${docType} documents`)
    
    // Delete in batches
    const deleteOperations = documents.map((doc: any) => ({
      delete: {id: doc._id}
    }))
    
    const result = await client.mutate(deleteOperations)
    console.log(`   ✅ Deleted ${documents.length} ${docType} documents`)
    
    return result
  } catch (error) {
    console.error(`   ❌ Error deleting ${docType} documents:`, error)
    throw error
  }
}

async function deleteDocumentsByQuery(query: string, description: string) {
  console.log(`🗑️  ${description}`)
  
  try {
    const documents = await client.fetch(query)
    
    if (documents.length === 0) {
      console.log(`   ✅ No documents found`)
      return
    }

    console.log(`   📊 Found ${documents.length} documents`)
    
    const deleteOperations = documents.map((doc: any) => ({
      delete: {id: doc._id}
    }))
    
    const result = await client.mutate(deleteOperations)
    console.log(`   ✅ Deleted ${documents.length} documents`)
    
    return result
  } catch (error) {
    console.error(`   ❌ Error:`, error)
    throw error
  }
}

export default async function festivalCleanup() {
  console.log('🎭 Starting Norwegian Festival CMS Cleanup')
  console.log('=========================================')
  
  const confirmed = process.env.CONFIRM_CLEANUP === 'true' || 
    process.argv.includes('--confirm')
  
  if (!confirmed) {
    console.log('⚠️  This will delete ALL festival content!')
    console.log('⚠️  Add --confirm flag or set CONFIRM_CLEANUP=true to proceed')
    console.log('')
    console.log('Preview of what will be deleted:')
    
    for (const docType of FESTIVAL_DOCUMENT_TYPES) {
      const count = await client.fetch(`count(*[_type == "${docType}"])`)
      console.log(`   • ${docType}: ${count} documents`)
    }
    
    return
  }

  try {
    // Delete all festival document types
    for (const docType of FESTIVAL_DOCUMENT_TYPES) {
      await deleteDocumentsByType(docType)
    }
    
    // Delete any draft versions
    await deleteDocumentsByQuery(
      `*[_id in path("drafts.**")]`,
      'Deleting all draft documents'
    )
    
    console.log('')
    console.log('🎉 Festival cleanup completed!')
    console.log('✨ Ready for next year\'s content')
    
  } catch (error) {
    console.error('💥 Cleanup failed:', error)
    process.exit(1)
  }
}