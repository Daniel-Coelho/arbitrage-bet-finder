
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Clock, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '../services/api';

export const AdminPanel: React.FC = () => {
  const [interval, setInterval] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getAdminSettings();
        setInterval(settings.intervalo);
      } catch (error) {
        console.error('Error fetching admin settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveInterval = async () => {
    setLoading(true);
    try {
      const result = await api.updateInterval(interval);
      if (result.sucesso) {
        toast({
          title: "Configuração Salva",
          description: `Intervalo atualizado para ${result.intervalo} minutos`,
          className: "bg-lime-500/10 border-lime-500/20 text-lime-300",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o intervalo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInterval(10);
    toast({
      title: "Configuração Resetada",
      description: "Intervalo voltou para 10 minutos",
      className: "bg-royal-500/10 border-royal-500/20 text-royal-300",
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 glass-card hover:bg-white/10"
      >
        <Settings className="h-4 w-4 mr-2" />
        Admin
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 glass-card z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Settings className="h-5 w-5 mr-2 text-royal-500" />
            Painel Admin
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Intervalo de Atualização (minutos)
          </Label>
          <Input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            min={1}
            max={60}
            className="bg-white/5 border-white/10 focus:border-royal-500"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSaveInterval}
            disabled={loading}
            className="flex-1 bg-lime-500 hover:bg-lime-600 text-black"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-3 border-white/10 hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Próxima atualização em {interval} minutos
        </div>
      </CardContent>
    </Card>
  );
};
