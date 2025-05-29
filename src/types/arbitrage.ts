
export interface ArbitrageOpportunity {
  time_home: string;
  time_away: string;
  odds: {
    home: { odd: number; casa: string };
    draw: { odd: number; casa: string };
    away: { odd: number; casa: string };
  };
  stakes: {
    home: string;
    draw: string;
    away: string;
    lucro: string;
  };
}

export interface AdminSettings {
  intervalo: number;
}
