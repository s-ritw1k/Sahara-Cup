import { io, Socket } from 'socket.io-client';
import type { Match, StandingsEntry, Tournament } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  connect() {
    if (this.socket?.connected) return;

    // Determine socket URL based on environment
    const socketUrl = import.meta.env.PROD 
      ? window.location.origin  // In production, use current domain
      : 'http://localhost:3001'; // In development, use local server

    this.socket = io(socketUrl);

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
    });

    // Handle real-time updates
    this.socket.on('matchUpdated', (match: Match) => {
      this.emit('matchUpdated', match);
    });

    this.socket.on('standingsUpdated', (standings: StandingsEntry[]) => {
      this.emit('standingsUpdated', standings);
    });

    this.socket.on('tournamentData', (tournament: Tournament) => {
      this.emit('tournamentData', tournament);
    });

    this.socket.on('standingsUpdate', (standings: StandingsEntry[]) => {
      this.emit('standingsUpdate', standings);
    });

    // Handle knockout updates
    this.socket.on('knockoutMatchUpdated', (match: any) => {
      this.emit('knockoutMatchUpdated', match);
    });

    this.socket.on('knockoutBracketUpdated', (matches: any[]) => {
      this.emit('knockoutBracketUpdated', matches);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
