import {getCliClient} from 'sanity/cli'

/**
 * Script to delete all genre documents
 * Run with: sanity exec scripts/cleanupGenres.ts --with-user-token
 */

const client = getCliClient()

export default async function cleanupGenres() {
  console.log('🏷️  Genre Cleanup Starting')
  console.log('=========================')
  
  try {
    // Get all genres
    const genres = await client.fetch(`*[_type == "genre"]`)
    
    if (genres.length === 0) {
      console.log('✅ No genres found to delete')
      return
    }
    
    console.log(`📊 Found ${genres.length} genres:`)
    genres.forEach((genre: any) => {
      console.log(`   • ${genre.title || 'Untitled'} (${genre._id})`)
    })
    
    const confirmed = process.env.CONFIRM_CLEANUP === 'true' || 
      process.argv.includes('--confirm')
    
    if (!confirmed) {
      console.log('')
      console.log('⚠️  Add --confirm flag to proceed with deletion')
      return
    }
    
    // Delete all genres
    const deleteOperations = genres.map((genre: any) => ({
      delete: {id: genre._id}
    }))
    
    const result = await client.mutate(deleteOperations)
    
    console.log('')
    console.log(`🗑️  Successfully deleted ${genres.length} genres`)
    console.log('✨ Genre cleanup completed!')
    
  } catch (error) {
    console.error('❌ Error during genre cleanup:', error)
    process.exit(1)
  }
}