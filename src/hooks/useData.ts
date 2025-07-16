import { useState, useEffect } from 'react';
import { tournamentApi } from '../services/api';
import { socketService } from '../services/socket';
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

    // Listen for real-time updates
    const handleTournamentData = (data: Tournament) => {
      setTournament(data);
    };

    socketService.on('tournamentData', handleTournamentData);

    return () => {
      socketService.off('tournamentData', handleTournamentData);
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

    // Listen for real-time match updates
    const handleMatchUpdate = (updatedMatch: Match) => {
      setMatches(prev => prev.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      ));
    };

    socketService.on('matchUpdated', handleMatchUpdate);

    return () => {
      socketService.off('matchUpdated', handleMatchUpdate);
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

    // Listen for real-time standings updates
    const handleStandingsUpdate = (updatedStandings: StandingsEntry[]) => {
      setStandings(updatedStandings);
    };

    socketService.on('standingsUpdated', handleStandingsUpdate);
    socketService.on('standingsUpdate', handleStandingsUpdate);

    return () => {
      socketService.off('standingsUpdated', handleStandingsUpdate);
      socketService.off('standingsUpdate', handleStandingsUpdate);
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

  const matchesWithPlayers = matches.map(match => {
    const player1 = tournament?.players.find(p => p.id === match.player1Id);
    const player2 = tournament?.players.find(p => p.id === match.player2Id);
    
    return {
      ...match,
      player1: player1 || { id: match.player1Id, name: 'Unknown' },
      player2: player2 || { id: match.player2Id, name: 'Unknown' },
    };
  });

  return { 
    matches: matchesWithPlayers, 
    loading: matchesLoading || !tournament, 
    error 
  };
}
