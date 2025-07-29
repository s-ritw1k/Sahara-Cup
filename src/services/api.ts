import type { Tournament, Match, StandingsEntry } from '../types';
import { SupabaseAPI } from './supabase-api';

// All API calls now use Supabase directly
export const tournamentApi = {
  getTournament: async (): Promise<Tournament> => {
    const tournament = await SupabaseAPI.getTournament();
    if (!tournament) throw new Error('Tournament not found');
    
    // Convert Supabase format to frontend format
    return {
      id: tournament.id,
      name: tournament.name,
      description: tournament.description || '',
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      status: tournament.status,
      players: await SupabaseAPI.getPlayers(),
      groups: (await SupabaseAPI.getGroups()).map(g => ({
        id: g.id,
        name: g.name,
        playerIds: g.player_ids
      })),
      matches: (await SupabaseAPI.getMatches()).map(m => ({
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
      knockoutMatches: (await SupabaseAPI.getKnockoutMatches()).map(m => ({
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
    };
  },

  getMatches: async (): Promise<Match[]> => {
    // Get group stage matches
    const groupMatches = await SupabaseAPI.getMatches();
    const formattedGroupMatches = groupMatches.map(m => ({
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
      winnerId: m.winner_id || undefined,
      round: m.round || 1
    }));

    // Get knockout matches and format them as regular matches
    const knockoutMatches = await SupabaseAPI.getKnockoutMatches();
    const formattedKnockoutMatches = knockoutMatches.map(m => ({
      id: m.id,
      player1Id: m.player1_id || undefined,
      player2Id: m.player2_id || undefined,
      player1Score: m.player1_score,
      player2Score: m.player2_score,
      player1SetScores: m.player1_set_scores,
      player2SetScores: m.player2_set_scores,
      scheduledTime: m.scheduled_time,
      status: m.status,
      groupId: undefined, // Knockout matches don't have group IDs
      winnerId: m.winner_id || undefined,
      round: m.round, // This will be 'quarterfinal', 'semifinal', etc.
      // Add knockout-specific properties
      matchNumber: m.match_number,
      player1Source: m.player1_source,
      player2Source: m.player2_source
    }));

    // Combine and return all matches
    return [...formattedGroupMatches, ...formattedKnockoutMatches];
  },

  getUpcomingMatches: async (): Promise<Match[]> => {
    const matches = await SupabaseAPI.getMatchesByStatus('upcoming');
    return matches.map(m => ({
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
    }));
  },

  getLiveMatches: async (): Promise<Match[]> => {
    const matches = await SupabaseAPI.getMatchesByStatus('live');
    return matches.map(m => ({
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
    }));
  },

  // Calculate standings from match data
  getStandings: async (): Promise<StandingsEntry[]> => {
    try {
      const players = await SupabaseAPI.getPlayers();
      
      // Get both group stage and knockout matches
      const groupMatches = await SupabaseAPI.getMatches();
      const knockoutMatches = await SupabaseAPI.getKnockoutMatches();
      
      // Combine all matches into a unified format
      const allMatches = [
        ...groupMatches.map(m => ({
          id: m.id,
          player1_id: m.player1_id,
          player2_id: m.player2_id,
          player1_score: m.player1_score,
          player2_score: m.player2_score,
          status: m.status,
          winner_id: m.winner_id
        })),
        ...knockoutMatches.map(m => ({
          id: m.id,
          player1_id: m.player1_id,
          player2_id: m.player2_id,
          player1_score: m.player1_score,
          player2_score: m.player2_score,
          status: m.status,
          winner_id: m.winner_id
        }))
      ];
      
      // Initialize standings for all players
      const standings: Record<string, StandingsEntry> = {};
      players.forEach(player => {
        standings[player.id] = {
          playerId: player.id,
          playerName: player.name,
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          points: 0,
          setsWon: 0,
          setsLost: 0,
          setDifference: 0
        };
      });

      // Calculate stats from completed matches (both group and knockout)
      const completedMatches = allMatches.filter(m => m.status === 'completed');
      completedMatches.forEach(match => {
        if (match.player1_id && match.player2_id && match.winner_id) {
          const player1Stats = standings[match.player1_id];
          const player2Stats = standings[match.player2_id];
          
          if (player1Stats && player2Stats) {
            // Update matches played
            player1Stats.matchesPlayed++;
            player2Stats.matchesPlayed++;
            
            // Update sets won/lost
            player1Stats.setsWon += match.player1_score || 0;
            player1Stats.setsLost += match.player2_score || 0;
            player2Stats.setsWon += match.player2_score || 0;
            player2Stats.setsLost += match.player1_score || 0;
            
            // Update set difference
            player1Stats.setDifference = player1Stats.setsWon - player1Stats.setsLost;
            player2Stats.setDifference = player2Stats.setsWon - player2Stats.setsLost;
            
            // Update wins/losses and points
            if (match.winner_id === match.player1_id) {
              player1Stats.wins++;
              player1Stats.points += 3; // 3 points for a win
              player2Stats.losses++;
            } else {
              player2Stats.wins++;
              player2Stats.points += 3; // 3 points for a win
              player1Stats.losses++;
            }
          }
        }
      });

      // Convert to array and sort by points, then by set difference
      return Object.values(standings)
        .sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points;
          if (a.setDifference !== b.setDifference) return b.setDifference - a.setDifference;
          return b.setsWon - a.setsWon;
        });
    } catch (error) {
      console.error('Error calculating standings:', error);
      throw new Error('Failed to calculate standings');
    }
  },

  getGroupStandings: async (groupId: string): Promise<StandingsEntry[]> => {
    try {
      const group = await SupabaseAPI.getGroup(groupId);
      if (!group) throw new Error(`Group ${groupId} not found`);
      
      const players = await SupabaseAPI.getPlayers();
      const matches = await SupabaseAPI.getMatches();
      
      // Initialize standings for players in this group
      const standings: Record<string, StandingsEntry> = {};
      group.player_ids.forEach(playerId => {
        const player = players.find(p => p.id === playerId);
        if (player) {
          standings[playerId] = {
            playerId: player.id,
            playerName: player.name,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            points: 0,
            setsWon: 0,
            setsLost: 0,
            setDifference: 0
          };
        }
      });

      // Filter matches for this group and calculate stats
      const groupMatches = matches.filter(m => m.group_id === groupId && m.status === 'completed');
      groupMatches.forEach(match => {
        if (match.player1_id && match.player2_id && match.winner_id) {
          const player1Stats = standings[match.player1_id];
          const player2Stats = standings[match.player2_id];
          
          if (player1Stats && player2Stats) {
            // Update matches played
            player1Stats.matchesPlayed++;
            player2Stats.matchesPlayed++;
            
            // Update sets won/lost
            player1Stats.setsWon += match.player1_score || 0;
            player1Stats.setsLost += match.player2_score || 0;
            player2Stats.setsWon += match.player2_score || 0;
            player2Stats.setsLost += match.player1_score || 0;
            
            // Update set difference
            player1Stats.setDifference = player1Stats.setsWon - player1Stats.setsLost;
            player2Stats.setDifference = player2Stats.setsWon - player2Stats.setsLost;
            
            // Update wins/losses and points
            if (match.winner_id === match.player1_id) {
              player1Stats.wins++;
              player1Stats.points += 3; // 3 points for a win
              player2Stats.losses++;
            } else {
              player2Stats.wins++;
              player2Stats.points += 3; // 3 points for a win
              player1Stats.losses++;
            }
          }
        }
      });

      // Convert to array and sort by points, then by set difference
      return Object.values(standings)
        .sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points;
          if (a.setDifference !== b.setDifference) return b.setDifference - a.setDifference;
          return b.setsWon - a.setsWon;
        });
    } catch (error) {
      console.error('Error calculating group standings:', error);
      throw new Error(`Failed to calculate standings for group ${groupId}`);
    }
  },

  getGroups: async () => {
    const groups = await SupabaseAPI.getGroups();
    return groups.map(g => ({
      id: g.id,
      name: g.name,
      playerIds: g.player_ids
    }));
  },

  // Knockout tournament endpoints
  getKnockout: async () => {
    const knockoutMatches = await SupabaseAPI.getKnockoutMatches();
    return knockoutMatches.map(m => ({
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
    }));
  },

  getQualifiedPlayers: async () => {
    return await SupabaseAPI.getQualifiedPlayers();
  },
};
