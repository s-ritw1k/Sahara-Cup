import { useState, useEffect } from 'react';
import type { StandingsEntry } from '../types';

export function useStandings() {
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/standings');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch standings: ${response.status}`);
        }
        
        const data = await response.json();
        setStandings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching standings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load standings');
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return { standings, loading, error };
}
