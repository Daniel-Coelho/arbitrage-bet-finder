
import React from 'react';
import { TrendingUp, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  opportunitiesCount: number;
  lastUpdated: Date | null;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  opportunitiesCount, 
  lastUpdated, 
  onRefresh, 
  loading 
}) => {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    return `${Math.floor(diff / 3600)}h atrás`;
  };

  return (
    <header className="glass-card p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-royal-lime flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-royal-lime bg-clip-text text-transparent">
              ArbitraGol Pro
            </h1>
            <p className="text-muted-foreground">
              Análise de Arbitragem em Apostas Esportivas
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-lime-500" />
              <Badge variant="outline" className="border-lime-500/30 text-lime-400">
                {opportunitiesCount} oportunidade{opportunitiesCount !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Última atualização: {formatLastUpdated(lastUpdated)}
            </div>
          </div>
          
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>
    </header>
  );
};
