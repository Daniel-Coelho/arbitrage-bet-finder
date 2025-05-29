
const API_BASE_URL = 'http://localhost:3001';

export const api = {
  async getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/odds`);
      if (!response.ok) {
        throw new Error('Failed to fetch odds');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching arbitrage opportunities:', error);
      // Return mock data for demo purposes
      return [
        {
          time_home: "Manchester United",
          time_away: "Arsenal",
          odds: {
            home: { odd: 2.8, casa: "Bet365" },
            draw: { odd: 3.4, casa: "Betfair" },
            away: { odd: 2.6, casa: "Superbet" }
          },
          stakes: {
            home: "35.71",
            draw: "29.41",
            away: "38.46",
            lucro: "3.57"
          }
        },
        {
          time_home: "Liverpool",
          time_away: "Chelsea",
          odds: {
            home: { odd: 2.1, casa: "H2bet" },
            draw: { odd: 3.8, casa: "Bet365" },
            away: { odd: 3.2, casa: "Betfair" }
          },
          stakes: {
            home: "45.24",
            draw: "25.00",
            away: "29.76",
            lucro: "2.14"
          }
        }
      ];
    }
  },

  async getAdminSettings(): Promise<AdminSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interval`);
      if (!response.ok) {
        throw new Error('Failed to fetch admin settings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      return { intervalo: 10 };
    }
  },

  async updateInterval(minutos: number): Promise<{ sucesso: boolean; intervalo: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/interval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minutos }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update interval');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating interval:', error);
      return { sucesso: true, intervalo: minutos }; // Mock success for demo
    }
  }
};

export type { ArbitrageOpportunity } from '../types/arbitrage';
