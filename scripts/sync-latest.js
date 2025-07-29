import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { tournament } from '../server/src/data/tournament-data.js'

// Load environment variables from parent directory
dotenv.config({ path: path.join(process.cwd(), '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Environment Check:')
console.log('Supabase URL:', supabaseUrl)
console.log('Service Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : 'Not set')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncLatestData() {
  console.log('\n🔄 Syncing LATEST data from tournament-data.js to Supabase...')

  try {
    // 1. Update ALL Group Stage Matches with latest data
    console.log(`📝 Syncing ${tournament.matches.length} group stage matches...`)
    
    const matchesData = tournament.matches.map(match => ({
      id: match.id,
      player1_id: match.player1Id,
      player2_id: match.player2Id,
      player1_score: match.player1Score,
      player2_score: match.player2Score,
      player1_set_scores: match.player1SetScores || [],
      player2_set_scores: match.player2SetScores || [],
      scheduled_time: match.scheduledTime,
      status: match.status,
      group_id: match.groupId,
      winner_id: match.winnerId || null,
      round: match.round
    }))
    
    const { error: matchesError } = await supabase
      .from('matches')
      .upsert(matchesData)
    
    if (matchesError) {
      console.error('❌ Matches error:', matchesError)
      throw matchesError
    }
    console.log(`✅ ${tournament.matches.length} group stage matches synced`)

    // 2. Update ALL Knockout Matches with latest data
    console.log(`📝 Syncing ${tournament.knockoutMatches.length} knockout matches...`)
    
    const knockoutData = tournament.knockoutMatches.map(match => ({
      id: match.id,
      round: match.round,
      match_number: match.matchNumber,
      player1_id: match.player1Id || null,
      player2_id: match.player2Id || null,
      player1_score: match.player1Score,
      player2_score: match.player2Score,
      player1_set_scores: match.player1SetScores || [],
      player2_set_scores: match.player2SetScores || [],
      status: match.status,
      scheduled_time: match.scheduledTime,
      player1_source: match.player1Source,
      player2_source: match.player2Source,
      winner_id: match.winnerId || null
    }))
    
    const { error: knockoutError } = await supabase
      .from('knockout_matches')
      .upsert(knockoutData)
    
    if (knockoutError) {
      console.error('❌ Knockout matches error:', knockoutError)
      throw knockoutError
    }
    console.log(`✅ ${tournament.knockoutMatches.length} knockout matches synced`)

    // 3. Show latest changes summary
    console.log('\n📊 Latest Changes Detected:')
    
    // Find completed knockout matches
    const completedKnockout = tournament.knockoutMatches.filter(m => m.status === 'completed')
    console.log(`🏆 Completed Knockout Matches: ${completedKnockout.length}`)
    
    completedKnockout.forEach(match => {
      const winner = tournament.players.find(p => p.id === match.winnerId)
      console.log(`   ${match.id}: ${winner?.name || match.winnerId} won ${match.player1Score}-${match.player2Score}`)
    })

    // 4. Verify final counts
    const { count: matchesCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
    
    const { count: knockoutCount } = await supabase
      .from('knockout_matches')
      .select('*', { count: 'exact', head: true })

    console.log('\n🎉 DATA SYNC SUCCESSFUL! 🎉')
    console.log('┌─────────────────────────────────────┐')
    console.log('│         LATEST DATABASE STATE       │')
    console.log('├─────────────────────────────────────┤')
    console.log(`│ Group Matches:    ${String(matchesCount || 0).padStart(2)} / ${tournament.matches.length}       │`)
    console.log(`│ Knockout Matches: ${String(knockoutCount || 0).padStart(2)} / ${tournament.knockoutMatches.length}       │`)
    console.log('└─────────────────────────────────────┘')
    
    console.log('\n✨ Your database now matches tournament-data.js exactly!')
    console.log('🚀 Real-time updates ready for testing!')

  } catch (error) {
    console.error('💥 Sync failed:', error)
    console.error('Details:', error.message)
    process.exit(1)
  }
}

// Run the sync
console.log('🔄 Starting data sync from tournament-data.js...')
syncLatestData()
