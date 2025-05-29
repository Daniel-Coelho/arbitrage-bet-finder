
import { useState, useEffect } from 'react';
import { api, ArbitrageOpportunity } from '../services/api';

export const useArbitrageData = () => {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getArbitrageOpportunities();
      setOpportunities(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchOpportunities, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    opportunities,
    loading,
    error,
    lastUpdated,
    refetch: fetchOpportunities
  };
};
