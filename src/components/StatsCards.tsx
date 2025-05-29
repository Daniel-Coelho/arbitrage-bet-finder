
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, DollarSign, Clock } from 'lucide-react';
import { ArbitrageOpportunity } from '../types/arbitrage';

interface StatsCardsProps {
  opportunities: ArbitrageOpportunity[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ opportunities }) => {
  const totalProfit = opportunities.reduce((sum, op) => sum + parseFloat(op.stakes.lucro), 0);
  const averageProfit = opportunities.length > 0 ? totalProfit / opportunities.length : 0;
  const bestOpportunity = opportunities.reduce((best, current) => 
    parseFloat(current.stakes.lucro) > parseFloat(best?.stakes?.lucro || '0') ? current : best, 
    opportunities[0]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
          <Target className="h-4 w-4 text-royal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-lime-400">{opportunities.length}</div>
          <p className="text-xs text-muted-foreground">
            Arbitragens disponíveis
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
          <DollarSign className="h-4 w-4 text-lime-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-lime-400">R$ {totalProfit.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Em apostas de R$ 100 cada
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">{averageProfit.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">
            Por oportunidade
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Melhor Odd</CardTitle>
          <Clock className="h-4 w-4 text-royal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-royal-400">
            {bestOpportunity ? `${bestOpportunity.stakes.lucro}%` : '0%'}
          </div>
          <p className="text-xs text-muted-foreground">
            {bestOpportunity ? `${bestOpportunity.time_home} vs ${bestOpportunity.time_away}` : 'Nenhuma'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
