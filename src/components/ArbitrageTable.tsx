
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target } from 'lucide-react';
import { ArbitrageOpportunity } from '../types/arbitrage';

interface ArbitrageTableProps {
  opportunities: ArbitrageOpportunity[];
  loading: boolean;
}

export const ArbitrageTable: React.FC<ArbitrageTableProps> = ({ opportunities, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Target className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">Nenhuma Arbitragem Encontrada</h3>
          <p className="text-muted-foreground text-center mt-2">
            Aguarde alguns minutos para a próxima atualização dos dados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opportunity, index) => (
        <Card key={index} className="glass-card profit-glow hover:shadow-lime-500/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold bg-gradient-royal-lime bg-clip-text text-transparent">
                {opportunity.time_home} vs {opportunity.time_away}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="arbitrage-badge animate-pulse-glow">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Lucro: {opportunity.stakes.lucro}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Odds Section */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Melhores Odds
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <span className="font-medium">{opportunity.time_home}</span>
                      <div className="text-xs text-muted-foreground">{opportunity.odds.home.casa}</div>
                    </div>
                    <div className="text-xl font-bold text-royal-500">{opportunity.odds.home.odd}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <span className="font-medium">Empate</span>
                      <div className="text-xs text-muted-foreground">{opportunity.odds.draw.casa}</div>
                    </div>
                    <div className="text-xl font-bold text-royal-500">{opportunity.odds.draw.odd}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <span className="font-medium">{opportunity.time_away}</span>
                      <div className="text-xs text-muted-foreground">{opportunity.odds.away.casa}</div>
                    </div>
                    <div className="text-xl font-bold text-royal-500">{opportunity.odds.away.odd}</div>
                  </div>
                </div>
              </div>

              {/* Stakes Section */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Valores de Aposta (Base: R$ 100)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-lime-500/10 border border-lime-500/20">
                    <span className="font-medium">{opportunity.time_home}</span>
                    <span className="text-lime-400 font-bold">R$ {opportunity.stakes.home}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-lime-500/10 border border-lime-500/20">
                    <span className="font-medium">Empate</span>
                    <span className="text-lime-400 font-bold">R$ {opportunity.stakes.draw}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 rounded-lg bg-lime-500/10 border border-lime-500/20">
                    <span className="font-medium">{opportunity.time_away}</span>
                    <span className="text-lime-400 font-bold">R$ {opportunity.stakes.away}</span>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-lime-500/20 to-green-500/20 border border-lime-500/30">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lime-300">Lucro Garantido:</span>
                      <span className="text-xl font-bold text-lime-300">R$ {opportunity.stakes.lucro}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
