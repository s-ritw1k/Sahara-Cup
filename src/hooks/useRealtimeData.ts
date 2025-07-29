import { useEffect, useState } from 'react'
import { SupabaseAPI } from '../services/supabase-api'
import type { Match, KnockoutMatch, Tournament } from '../types'

// Hook for real-time matches updates
export const useRealtimeMatches = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInitialData = async () => {
    try {
      const matchesData = await SupabaseAPI.getMatches()
      const formattedMatches = matchesData.map(m => ({
        id: m.id,
        player1Id: m.player1_id,
        player2Id: m.player2_id,
        player1Score: m.player1_score,
        player2Score: m.player2_score,
        player1SetScores: m.player1_set_scores,
        player2SetScores: m.player2_set_scores,
        scheduledTime: m.scheduled_time,
        status: m.status,
        groupId: m.group_id || '',
        winnerId: m.winner_id,
        round: m.round || 1
      }))
      setMatches(formattedMatches)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      setLoading(false)
    }
  }

  useEffect(() => {
    let subscription: any

    const setupSubscription = () => {
      subscription = SupabaseAPI.subscribeToMatches((payload) => {
        console.log('Match update received:', payload)
        
        // Refetch all matches when any change occurs
        // In a more optimized version, you could handle individual CRUD operations
        fetchInitialData()
      })
    }

    fetchInitialData()
    setupSubscription()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { matches, loading, error, refetch: fetchInitialData }
}

// Hook for real-time knockout matches updates
export const useRealtimeKnockoutMatches = () => {
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInitialData = async () => {
    try {
      const matchesData = await SupabaseAPI.getKnockoutMatches()
      const formattedMatches = matchesData.map(m => ({
        id: m.id,
        round: m.round,
        matchNumber: m.match_number,
        player1Id: m.player1_id,
        player2Id: m.player2_id,
        player1Score: m.player1_score,
        player2Score: m.player2_score,
        player1SetScores: m.player1_set_scores,
        player2SetScores: m.player2_set_scores,
        status: m.status,
        scheduledTime: m.scheduled_time,
        player1Source: m.player1_source,
        player2Source: m.player2_source,
        winnerId: m.winner_id
      }))
      setKnockoutMatches(formattedMatches)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch knockout matches')
      setLoading(false)
    }
  }

  useEffect(() => {
    let subscription: any

    const setupSubscription = () => {
      subscription = SupabaseAPI.subscribeToKnockoutMatches((payload) => {
        console.log('Knockout match update received:', payload)
        fetchInitialData()
      })
    }

    fetchInitialData()
    setupSubscription()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { knockoutMatches, loading, error, refetch: fetchInitialData }
}

// Hook for real-time tournament updates
export const useRealtimeTournament = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInitialData = async () => {
    try {
      const tournamentData = await SupabaseAPI.getTournament()
      if (tournamentData) {
        const players = await SupabaseAPI.getPlayers()
        const groups = await SupabaseAPI.getGroups()
        const matches = await SupabaseAPI.getMatches()
        const knockoutMatches = await SupabaseAPI.getKnockoutMatches()

        const formattedTournament: Tournament = {
          id: tournamentData.id,
          name: tournamentData.name,
          description: tournamentData.description || '',
          startDate: tournamentData.start_date,
          endDate: tournamentData.end_date,
          status: tournamentData.status,
          players,
          groups: groups.map(g => ({
            id: g.id,
            name: g.name,
            playerIds: g.player_ids
          })),
          matches: matches.map(m => ({
            id: m.id,
            player1Id: m.player1_id,
            player2Id: m.player2_id,
            player1Score: m.player1_score,
            player2Score: m.player2_score,
            player1SetScores: m.player1_set_scores,
            player2SetScores: m.player2_set_scores,
            scheduledTime: m.scheduled_time,
            status: m.status,
            groupId: m.group_id || '',
            winnerId: m.winner_id,
            round: m.round || 1
          })),
          knockoutMatches: knockoutMatches.map(m => ({
            id: m.id,
            round: m.round,
            matchNumber: m.match_number,
            player1Id: m.player1_id,
            player2Id: m.player2_id,
            player1Score: m.player1_score,
            player2Score: m.player2_score,
            player1SetScores: m.player1_set_scores,
            player2SetScores: m.player2_set_scores,
            status: m.status,
            scheduledTime: m.scheduled_time,
            player1Source: m.player1_source,
            player2Source: m.player2_source,
            winnerId: m.winner_id
          }))
        }

        setTournament(formattedTournament)
      }
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament')
      setLoading(false)
    }
  }

  useEffect(() => {
    let subscription: any

    const setupSubscription = () => {
      subscription = SupabaseAPI.subscribeToTournament((payload) => {
        console.log('Tournament update received:', payload)
        fetchInitialData()
      })
    }

    fetchInitialData()
    setupSubscription()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return { tournament, loading, error, refetch: fetchInitialData }
}

// Combined hook for all real-time updates
export const useRealtimeData = () => {
  const matches = useRealtimeMatches()
  const knockoutMatches = useRealtimeKnockoutMatches()
  const tournament = useRealtimeTournament()

  return {
    matches,
    knockoutMatches,
    tournament,
    loading: matches.loading || knockoutMatches.loading || tournament.loading,
    error: matches.error || knockoutMatches.error || tournament.error
  }
}
