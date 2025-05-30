
# ArbitraGol Backend

Backend Node.js para detecção de arbitragem em apostas esportivas usando The Odds API.

## Configuração

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente:**
O arquivo `.env` já está configurado com a chave da API.

3. **Testar conexão com The Odds API:**
```bash
npm run test-api
```

4. **Iniciar o servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints

### GET /odds
Retorna oportunidades de arbitragem detectadas.

### GET /admin/interval
Retorna o intervalo atual de atualização em minutos.

### POST /admin/interval
Atualiza o intervalo de busca.
```json
{
  "minutos": 15
}
```

### GET /health
Status do backend e informações da API.

## Funcionalidades

- ✅ Integração com The Odds API
- ✅ Detecção automática de arbitragem
- ✅ Cache inteligente com TTL de 5 minutos
- ✅ Monitoramento de quota da API
- ✅ Rate limiting para evitar bloqueios
- ✅ Múltiplos campeonatos de futebol
- ✅ Atualização automática configurável
- ✅ Dados mock como fallback

## Esportes Monitorados

- Brasileirão (soccer_brazil_campeonato)
- Premier League (soccer_epl)
- La Liga (soccer_spain_la_liga)
- Bundesliga (soccer_germany_bundesliga)
- Serie A (soccer_italy_serie_a)
- Ligue 1 (soccer_france_ligue_one)
- Euro (soccer_uefa_european_championship)

## Estrutura do Projeto

```
backend/
├── server.js              # Servidor Express principal
├── cache/
│   └── memoryCache.js     # Sistema de cache em memória
├── services/
│   └── oddsService.js     # Integração com The Odds API
├── utils/
│   ├── arbitrageCalculator.js  # Cálculos de arbitragem
│   └── dataMapper.js      # Transformação de dados
├── routes/
│   ├── oddsRoutes.js      # Endpoint /odds
│   └── adminRoutes.js     # Endpoints /admin
└── test-api.js           # Teste da conexão com API
```
