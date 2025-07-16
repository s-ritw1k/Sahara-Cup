import axios from 'axios';
import type { Tournament, Match, StandingsEntry } from '../types';

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production (Vercel), use relative path
  : 'http://localhost:3001/api'; // In development, use full URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API calls
export const tournamentApi = {
  getTournament: async (): Promise<Tournament> => {
    const response = await api.get('/tournament');
    return response.data;
  },

  getMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches');
    return response.data;
  },

  getUpcomingMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches/upcoming');
    return response.data;
  },

  getLiveMatches: async (): Promise<Match[]> => {
    const response = await api.get('/matches/live');
    return response.data;
  },

  getStandings: async (): Promise<StandingsEntry[]> => {
    const response = await api.get('/standings');
    return response.data;
  },

  getGroupStandings: async (groupId: string): Promise<StandingsEntry[]> => {
    const response = await api.get(`/standings/group/${groupId}`);
    return response.data;
  },

  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  // Knockout tournament endpoints
  getKnockout: async () => {
    const response = await api.get('/knockout');
    return response.data;
  },

  getQualifiedPlayers: async () => {
    const response = await api.get('/knockout/qualified-players');
    return response.data;
  },
};

// Admin API calls (now uses direct authentication with username/password in each request)
export const adminApi = {
  updateMatch: async (
    matchId: string, 
    data: { 
      player1Score: number; 
      player2Score: number; 
      status: string;
      username: string;
      password: string;
    }
  ): Promise<Match> => {
    const response = await api.put(`/admin/matches/${matchId}`, data);
    return response.data;
  },

  startMatch: async (
    matchId: string, 
    credentials: { username: string; password: string }
  ): Promise<Match> => {
    const response = await api.post(`/admin/matches/${matchId}/start`, credentials);
    return response.data;
  },

  // Knockout match admin endpoints
  updateKnockoutMatch: async (
    matchId: string, 
    data: { 
      player1Score: number; 
      player2Score: number; 
      status: string;
      username: string;
      password: string;
    }
  ): Promise<Match> => {
    const response = await api.put(`/admin/knockout/${matchId}`, data);
    return response.data;
  },

  startKnockoutMatch: async (
    matchId: string, 
    credentials: { username: string; password: string }
  ): Promise<Match> => {
    const response = await api.post(`/admin/knockout/${matchId}/start`, credentials);
    return response.data;
  },

  setKnockoutMatchPlayers: async (
    matchId: string, 
    data: { 
      player1Id?: string; 
      player2Id?: string; 
      username: string; 
      password: string; 
    }
  ): Promise<Match> => {
    const response = await api.put(`/admin/knockout/${matchId}/players`, data);
    return response.data;
  },
};
