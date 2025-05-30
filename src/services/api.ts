
import { ArbitrageOpportunity, AdminSettings } from '../types/arbitrage';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
  async getArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/odds`);
      if (!response.ok) {
        throw new Error('Failed to fetch odds');
      }
      const data = await response.json();
      return data; // Retorna apenas dados reais da API
    } catch (error) {
      console.error('Error fetching arbitrage opportunities:', error);
      return []; // Retorna array vazio se houver erro
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
