import { supabase } from '../lib/supabase'
import type { Player, Group, Match, KnockoutMatch, Tournament } from '../lib/supabase'

export class SupabaseAPI {
  // Tournament methods
  static async getTournament(): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', 'sahara-cup-2025')
      .single()
    
    if (error) throw error
    return data
  }

  static async updateTournament(updates: Partial<Tournament>): Promise<void> {
    const { error } = await supabase
      .from('tournaments')
      .update(updates)
      .eq('id', 'sahara-cup-2025')
    
    if (error) throw error
  }

  // Player methods
  static async getPlayers(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getPlayer(id: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async createPlayer(player: Omit<Player, 'created_at' | 'updated_at'>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert(player)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updatePlayer(id: string, updates: Partial<Player>): Promise<void> {
    const { error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
  }

  // Group methods
  static async getGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  }

  static async getGroup(id: string): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateGroup(id: string, updates: Partial<Group>): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
  }

  // Match methods
  static async getMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('scheduled_time')
    
    if (error) throw error
    return data || []
  }

  static async getMatch(id: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async getMatchesByGroup(groupId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('group_id', groupId)
      .order('scheduled_time')
    
    if (error) throw error
    return data || []
  }

  static async getMatchesByStatus(status: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', status)
      .order('scheduled_time')
    
    if (error) throw error
    return data || []
  }

  static async updateMatch(id: string, updates: Partial<Match>): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
  }

  static async startMatch(id: string): Promise<void> {
    await this.updateMatch(id, { status: 'live' })
  }

  static async completeMatch(
    id: string, 
    player1Score: number, 
    player2Score: number, 
    player1SetScores: number[], 
    player2SetScores: number[],
    winnerId: string
  ): Promise<void> {
    await this.updateMatch(id, {
      status: 'completed',
      player1_score: player1Score,
      player2_score: player2Score,
      player1_set_scores: player1SetScores,
      player2_set_scores: player2SetScores,
      winner_id: winnerId
    })
  }

  // Knockout match methods
  static async getKnockoutMatches(): Promise<KnockoutMatch[]> {
    const { data, error } = await supabase
      .from('knockout_matches')
      .select('*')
      .order('scheduled_time')
    
    if (error) throw error
    return data || []
  }

  static async getKnockoutMatch(id: string): Promise<KnockoutMatch | null> {
    const { data, error } = await supabase
      .from('knockout_matches')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async getKnockoutMatchesByRound(round: string): Promise<KnockoutMatch[]> {
    const { data, error } = await supabase
      .from('knockout_matches')
      .select('*')
      .eq('round', round)
      .order('match_number')
    
    if (error) throw error
    return data || []
  }

  static async updateKnockoutMatch(id: string, updates: Partial<KnockoutMatch>): Promise<void> {
    const { error } = await supabase
      .from('knockout_matches')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
  }

  static async startKnockoutMatch(id: string): Promise<void> {
    await this.updateKnockoutMatch(id, { status: 'live' })
  }

  static async completeKnockoutMatch(
    id: string,
    player1Score: number,
    player2Score: number,
    player1SetScores: number[],
    player2SetScores: number[],
    winnerId: string
  ): Promise<void> {
    await this.updateKnockoutMatch(id, {
      status: 'completed',
      player1_score: player1Score,
      player2_score: player2Score,
      player1_set_scores: player1SetScores,
      player2_set_scores: player2SetScores,
      winner_id: winnerId
    })
  }

  // Qualified players for knockout
  static async getQualifiedPlayers(): Promise<{ playerId: string; group: string; position: number }[]> {
    // Get all groups with their players
    const groups = await this.getGroups()
    const matches = await this.getMatches()
    
    const qualifiedPlayers: { playerId: string; group: string; position: number }[] = []
    
    for (const group of groups) {
      // Calculate standings for this group
      const groupMatches = matches.filter(m => m.group_id === group.id && m.status === 'completed')
      const playerStats: Record<string, { wins: number; losses: number; setDiff: number }> = {}
      
      // Initialize stats for all players in group
      group.player_ids.forEach(playerId => {
        playerStats[playerId] = { wins: 0, losses: 0, setDiff: 0 }
      })
      
      // Calculate stats from completed matches
      groupMatches.forEach(match => {
        if (match.winner_id) {
          const winnerId = match.winner_id
          const loserId = match.player1_id === winnerId ? match.player2_id : match.player1_id
          
          playerStats[winnerId].wins++
          playerStats[loserId].losses++
          
          // Calculate set difference
          const winnerSetScore = match.player1_id === winnerId ? match.player1_score : match.player2_score
          const loserSetScore = match.player1_id === winnerId ? match.player2_score : match.player1_score
          
          playerStats[winnerId].setDiff += (winnerSetScore - loserSetScore)
          playerStats[loserId].setDiff += (loserSetScore - winnerSetScore)
        }
      })
      
      // Sort players by wins, then by set difference
      const sortedPlayers = group.player_ids
        .map(playerId => ({ playerId, ...playerStats[playerId] }))
        .sort((a, b) => {
          if (a.wins !== b.wins) return b.wins - a.wins
          return b.setDiff - a.setDiff
        })
      
      // Top 2 players qualify
      sortedPlayers.slice(0, 2).forEach((player, index) => {
        qualifiedPlayers.push({
          playerId: player.playerId,
          group: group.name,
          position: index + 1
        })
      })
    }
    
    return qualifiedPlayers
  }

  // Real-time subscriptions
  static subscribeToMatches(callback: (payload: any) => void) {
    return supabase
      .channel('matches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, callback)
      .subscribe()
  }

  static subscribeToKnockoutMatches(callback: (payload: any) => void) {
    return supabase
      .channel('knockout_matches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'knockout_matches'
      }, callback)
      .subscribe()
  }

  static subscribeToTournament(callback: (payload: any) => void) {
    return supabase
      .channel('tournament')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tournaments'
      }, callback)
      .subscribe()
  }
}
