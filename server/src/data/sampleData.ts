import { Tournament } from '../types';
import { tournament as sharedTournament, defaultAdmin as sharedDefaultAdmin } from './tournament-data';

// Re-export shared tournament data with proper TypeScript typing
export const tournament: Tournament = sharedTournament;

// Default admin user (password: admin123)
export const defaultAdmin = sharedDefaultAdmin;
