-- Supabase SQL Schema for Sahara Cup Tournament
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tournaments table
CREATE TABLE tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create groups table
CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  player_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matches table (for group stage matches)
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  player1_id TEXT NOT NULL REFERENCES players(id),
  player2_id TEXT NOT NULL REFERENCES players(id),
  player1_score INTEGER NOT NULL DEFAULT 0,
  player2_score INTEGER NOT NULL DEFAULT 0,
  player1_set_scores INTEGER[] NOT NULL DEFAULT '{}',
  player2_set_scores INTEGER[] NOT NULL DEFAULT '{}',
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  group_id TEXT REFERENCES groups(id),
  winner_id TEXT REFERENCES players(id),
  round INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knockout_matches table
CREATE TABLE knockout_matches (
  id TEXT PRIMARY KEY,
  round TEXT NOT NULL CHECK (round IN ('round16', 'quarterfinal', 'semifinal', 'final')),
  match_number INTEGER NOT NULL,
  player1_id TEXT REFERENCES players(id),
  player2_id TEXT REFERENCES players(id),
  player1_score INTEGER NOT NULL DEFAULT 0,
  player2_score INTEGER NOT NULL DEFAULT 0,
  player1_set_scores INTEGER[] NOT NULL DEFAULT '{}',
  player2_set_scores INTEGER[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  scheduled_time TIMESTAMPTZ NOT NULL,
  player1_source JSONB NOT NULL,
  player2_source JSONB NOT NULL,
  winner_id TEXT REFERENCES players(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knockout_matches_updated_at BEFORE UPDATE ON knockout_matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE knockout_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON groups FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON knockout_matches FOR SELECT USING (true);

-- Create policies for admin write access (you'll need to implement proper admin authentication)
CREATE POLICY "Allow admin write access" ON tournaments FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON players FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON groups FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON matches FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON knockout_matches FOR ALL USING (true);
CREATE POLICY "Allow admin read access" ON admins FOR SELECT USING (true);
CREATE POLICY "Allow admin write access" ON admins FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_matches_group_id ON matches(group_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_knockout_matches_round ON knockout_matches(round);
CREATE INDEX idx_knockout_matches_status ON knockout_matches(status);
CREATE INDEX idx_groups_player_ids ON groups USING GIN(player_ids);

-- Insert tournament data
INSERT INTO tournaments (id, name, description, start_date, end_date, status) VALUES 
('sahara-cup-2025', 'Sahara Cup 2025', 'Annual Table Tennis Tournament', '2025-07-22T09:00:00Z', '2025-07-23T18:00:00Z', 'active');

-- Insert admin data
INSERT INTO admins (id, username, password, name) VALUES 
('admin1', 'admin', '$2a$10$rQzXZo.gOGNVUYyiVRvPE.eJVx3V/wJWD4y8QR4U4F0.F6qFsGz1K', 'Tournament Admin');
