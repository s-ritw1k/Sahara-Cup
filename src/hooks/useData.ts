import { useState, useEffect } from 'react';
import { tournamentApi } from '../services/api';
import { SupabaseAPI } from '../services/supabase-api';
import type { Tournament, Match, StandingsEntry, MatchWithPlayers } from '../types';

export function useTournament() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const data = await tournamentApi.getTournament();
        setTournament(data);
        setError(null);
      } catch (err) {
        setError('Failed to load tournament data');
        console.error('Tournament fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();

    // Setup Supabase real-time subscriptions for tournament data
    const subscription = SupabaseAPI.subscribeToTournament((data) => {
      setTournament(data);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { tournament, loading, error };
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await tournamentApi.getMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        setError('Failed to load matches');
        console.error('Matches fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Setup Supabase real-time subscriptions for matches
    const subscription = SupabaseAPI.subscribeToMatches((updatedMatches) => {
      setMatches(updatedMatches);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { matches, loading, error };
}

export function useStandings() {
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const data = await tournamentApi.getStandings();
        setStandings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load standings');
        console.error('Standings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();

    // Note: Standings are calculated in real-time from match data
    // No need for separate subscription as they update when matches change

    return () => {
      // No cleanup needed for calculated standings
    };
  }, []);

  return { standings, loading, error };
}

export function useMatchesWithPlayers(): { 
  matches: MatchWithPlayers[], 
  loading: boolean, 
  error: string | null 
} {
  const { tournament } = useTournament();
  const { matches, loading: matchesLoading, error } = useMatches();

  const matchesWithPlayers = matches
    .map(match => {
      // Find players, handling undefined player IDs for TBD knockout matches
      const player1 = match.player1Id ? tournament?.players.find(p => p.id === match.player1Id) : null;
      const player2 = match.player2Id ? tournament?.players.find(p => p.id === match.player2Id) : null;
      
      return {
        ...match,
        player1: player1 || (match.player1Id ? { id: match.player1Id, name: 'Unknown' } : null),
        player2: player2 || (match.player2Id ? { id: match.player2Id, name: 'Unknown' } : null),
      };
    })
    .filter((match): match is MatchWithPlayers => match.player1 !== null && match.player2 !== null); // Type guard filter

  return { 
    matches: matchesWithPlayers, 
    loading: matchesLoading || !tournament, 
    error 
  };
}

export function useKnockoutMatches() {
  const [knockoutMatches, setKnockoutMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnockoutMatches = async () => {
      try {
        const data = await SupabaseAPI.getKnockoutMatches();
        setKnockoutMatches(data);
        setError(null);
      } catch (err) {
        setError('Failed to load knockout matches');
        console.error('Knockout matches fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKnockoutMatches();

    // Setup Supabase real-time subscriptions for knockout matches
    const subscription = SupabaseAPI.subscribeToKnockoutMatches((payload) => {
      if (payload.eventType === 'INSERT') {
        setKnockoutMatches(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setKnockoutMatches(prev => prev.map(match => 
          match.id === payload.new.id ? payload.new : match
        ));
      } else if (payload.eventType === 'DELETE') {
        setKnockoutMatches(prev => prev.filter(match => match.id !== payload.old.id));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { knockoutMatches, loading, error };
}

export function useKnockoutMatchesWithPlayers() {
  const { tournament } = useTournament();
  const { knockoutMatches, loading: knockoutLoading, error } = useKnockoutMatches();

  const knockoutMatchesWithPlayers = knockoutMatches.map(match => {
    const player1 = match.player1_id ? tournament?.players.find(p => p.id === match.player1_id) : null;
    const player2 = match.player2_id ? tournament?.players.find(p => p.id === match.player2_id) : null;
    
    return {
      ...match,
      id: match.id,
      round: match.round,
      matchNumber: match.match_number,
      player1Id: match.player1_id,
      player2Id: match.player2_id,
      player1Score: match.player1_score,
      player2Score: match.player2_score,
      player1SetScores: match.player1_set_scores,
      player2SetScores: match.player2_set_scores,
      status: match.status,
      scheduledTime: match.scheduled_time,
      winnerId: match.winner_id,
      player1: player1 || (match.player1_id ? { id: match.player1_id, name: 'TBD' } : { id: '', name: 'TBD' }),
      player2: player2 || (match.player2_id ? { id: match.player2_id, name: 'TBD' } : { id: '', name: 'TBD' }),
    };
  });

  return { 
    knockoutMatches: knockoutMatchesWithPlayers, 
    loading: knockoutLoading || !tournament, 
    error 
  };
}
