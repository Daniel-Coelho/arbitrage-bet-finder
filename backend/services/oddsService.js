const axios = require('axios');
const cron = require('node-cron');
const { getCachedOpportunities, setCachedOpportunities, getUpdateInterval } = require('../cache/memoryCache');
const { calculateArbitrage } = require('../utils/arbitrageCalculator');
const { mapApiDataToFrontend } = require('../utils/dataMapper');

const API_BASE_URL = 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.ODDS_API_KEY;

// Lista inicial conservadora - será validada dinamicamente
const INITIAL_SPORTS = [
  // Esportes mais comuns que geralmente estão disponíveis
  'soccer_epl',
  'soccer_spain_la_liga', 
  'soccer_uefa_champs_league',
  'basketball_nba'
];

let validatedSports = [];
let cronJob = null;
let currentSportIndex = 0;

async function validateSportsAvailability() {
  console.log('🔍 Validating available sports...');
  
  try {
    const sportsResponse = await axios.get(`${API_BASE_URL}/sports`, {
      params: { apiKey: API_KEY }
    });
    
    const availableSports = sportsResponse.data.filter(sport => sport.active);
    
    // Filtrar apenas esportes de futebol e basquete que estão realmente disponíveis
    const footballSports = availableSports.filter(sport => 
      sport.group === 'Soccer' && sport.active
    ).slice(0, 5); // Máximo 5 ligas de futebol
    
    const basketballSports = availableSports.filter(sport => 
      sport.group === 'Basketball' && sport.active
    ).slice(0, 3); // Máximo 3 ligas de basquete
    
    validatedSports = [
      ...footballSports.map(s => s.key),
      ...basketballSports.map(s => s.key)
    ];
    
    console.log(`✅ Validated ${validatedSports.length} available sports:`);
    validatedSports.forEach(sport => console.log(`   - ${sport}`));
    
    return validatedSports;
    
  } catch (error) {
    console.error('❌ Error validating sports:', error.message);
    // Fallback para lista inicial em caso de erro
    validatedSports = INITIAL_SPORTS;
    return validatedSports;
  }
}

async function fetchOddsFromAPI() {
  // Garantir que temos esportes validados
  if (validatedSports.length === 0) {
    await validateSportsAvailability();
  }
  
  if (validatedSports.length === 0) {
    console.log('⚠️ No validated sports available, returning empty data');
    return [];
  }
  
  const sport = validatedSports[currentSportIndex];
  currentSportIndex = (currentSportIndex + 1) % validatedSports.length;
  
  try {
    console.log(`🔍 Fetching odds for ${sport}...`);
    
    const response = await axios.get(`${API_BASE_URL}/sports/${sport}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: 'us,uk,eu,au',
        markets: 'h2h',
        oddsFormat: 'decimal'
      },
      timeout: 10000
    });

    const quotaInfo = {
      remaining: response.headers['x-requests-remaining'],
      used: response.headers['x-requests-used'],
      last: response.headers['x-requests-last']
    };

    console.log(`📊 Quota: ${quotaInfo.remaining} remaining, ${quotaInfo.used} used`);

    if (response.data && response.data.length > 0) {
      const arbitrageOpportunities = findArbitrageOpportunities(response.data);
      const mappedData = arbitrageOpportunities.map(mapApiDataToFrontend);
      
      setCachedOpportunities(mappedData, quotaInfo);
      console.log(`✅ Found ${mappedData.length} arbitrage opportunities for ${sport}`);
      
      return mappedData;
    } else {
      console.log(`⚠️ No games found for ${sport}`);
      return [];
    }

  } catch (error) {
    console.error(`❌ Error fetching odds for ${sport}:`, error.message);
    
    if (error.response?.status === 422) {
      console.log(`⚠️ Sport ${sport} parameters invalid, removing from list`);
      // Remover esporte inválido da lista
      validatedSports = validatedSports.filter(s => s !== sport);
      currentSportIndex = 0; // Reset index
    } else if (error.response?.status === 429) {
      console.log('⏳ Rate limited, waiting before next request...');
    }
    
    // Return cached data if available, otherwise empty array
    const cached = getCachedOpportunities();
    return cached ? cached.data : [];
  }
}

function findArbitrageOpportunities(games) {
  const opportunities = [];
  
  games.forEach(game => {
    if (!game.bookmakers || game.bookmakers.length < 2) return;
    
    const bestOdds = findBestOdds(game);
    if (!bestOdds) return;
    
    const arbitrage = calculateArbitrage(bestOdds.home.odd, bestOdds.draw.odd, bestOdds.away.odd);
    
    if (arbitrage.hasArbitrage && arbitrage.profit > 1) {
      opportunities.push({
        ...game,
        bestOdds,
        arbitrage
      });
    }
  });
  
  return opportunities.sort((a, b) => b.arbitrage.profit - a.arbitrage.profit);
}

function findBestOdds(game) {
  let bestHome = { odd: 0, bookmaker: '' };
  let bestDraw = { odd: 0, bookmaker: '' };
  let bestAway = { odd: 0, bookmaker: '' };
  
  game.bookmakers.forEach(bookmaker => {
    const h2hMarket = bookmaker.markets?.find(market => market.key === 'h2h');
    if (!h2hMarket) return;
    
    h2hMarket.outcomes.forEach(outcome => {
      if (outcome.name === game.home_team && outcome.price > bestHome.odd) {
        bestHome = { odd: outcome.price, bookmaker: bookmaker.title };
      } else if (outcome.name === game.away_team && outcome.price > bestAway.odd) {
        bestAway = { odd: outcome.price, bookmaker: bookmaker.title };
      } else if (outcome.name === 'Draw' && outcome.price > bestDraw.odd) {
        bestDraw = { odd: outcome.price, bookmaker: bookmaker.title };
      }
    });
  });
  
  // Para esportes sem empate (basquete, e-sports), definir empate como 0
  if (bestDraw.odd === 0) {
    bestDraw = { odd: 999, bookmaker: 'N/A' }; // Odd muito alta para não afetar cálculo
  }
  
  if (bestHome.odd > 0 && bestAway.odd > 0) {
    return { home: bestHome, draw: bestDraw, away: bestAway };
  }
  
  return null;
}

async function startDataUpdater() {
  const updateIntervalMinutes = Math.floor(getUpdateInterval() / 60000);
  
  // Validar esportes disponíveis antes de iniciar
  await validateSportsAvailability();
  
  // Initial fetch
  fetchOddsFromAPI();
  
  // Schedule periodic updates
  if (cronJob) {
    cronJob.destroy();
  }
  
  cronJob = cron.schedule(`*/${updateIntervalMinutes} * * * *`, async () => {
    console.log('🔄 Scheduled update starting...');
    await fetchOddsFromAPI();
  });
  
  console.log(`⏰ Data updater scheduled every ${updateIntervalMinutes} minutes`);
}

function restartDataUpdater() {
  console.log('🔄 Restarting data updater...');
  startDataUpdater();
}

async function getArbitrageOpportunities() {
  const cached = getCachedOpportunities();
  
  if (cached) {
    return {
      opportunities: cached.data,
      lastUpdated: cached.lastUpdated,
      fromCache: true
    };
  }
  
  const opportunities = await fetchOddsFromAPI();
  return {
    opportunities,
    lastUpdated: new Date().toISOString(),
    fromCache: false
  };
}

module.exports = {
  getArbitrageOpportunities,
  startDataUpdater,
  restartDataUpdater,
  fetchOddsFromAPI
};
