import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types
export interface Player {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface Group {
  id: string
  name: string
  player_ids: string[]
  created_at?: string
  updated_at?: string
}

export interface Match {
  id: string
  player1_id: string
  player2_id: string
  player1_score: number
  player2_score: number
  player1_set_scores: number[]
  player2_set_scores: number[]
  scheduled_time: string
  status: 'upcoming' | 'live' | 'completed'
  group_id?: string
  winner_id?: string
  round?: number
  created_at?: string
  updated_at?: string
}

export interface KnockoutMatch {
  id: string
  round: 'round16' | 'quarterfinal' | 'semifinal' | 'final'
  match_number: number
  player1_id?: string
  player2_id?: string
  player1_score: number
  player2_score: number
  player1_set_scores: number[]
  player2_set_scores: number[]
  status: 'upcoming' | 'live' | 'completed'
  scheduled_time: string
  player1_source: {
    type: 'group' | 'match'
    value: string
    position?: number
  }
  player2_source: {
    type: 'group' | 'match'
    value: string
    position?: number
  }
  winner_id?: string
  created_at?: string
  updated_at?: string
}

export interface Tournament {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'completed'
  created_at?: string
  updated_at?: string
}

export interface Admin {
  id: string
  username: string
  password: string
  name: string
  created_at?: string
  updated_at?: string
}
