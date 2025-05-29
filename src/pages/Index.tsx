
import React from 'react';
import { Header } from '../components/Header';
import { StatsCards } from '../components/StatsCards';
import { ArbitrageTable } from '../components/ArbitrageTable';
import { AdminPanel } from '../components/AdminPanel';
import { useArbitrageData } from '../hooks/useArbitrageData';

const Index = () => {
  const { opportunities, loading, lastUpdated, refetch } = useArbitrageData();

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          opportunitiesCount={opportunities.length}
          lastUpdated={lastUpdated}
          onRefresh={refetch}
          loading={loading}
        />
        
        <StatsCards opportunities={opportunities} />
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="h-6 w-1 bg-gradient-royal-lime rounded mr-3"></span>
            Oportunidades de Arbitragem
          </h2>
          
          <ArbitrageTable 
            opportunities={opportunities} 
            loading={loading} 
          />
        </div>
        
        <AdminPanel />
      </div>
    </div>
  );
};

export default Index;
