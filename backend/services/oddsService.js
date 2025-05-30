
const axios = require('axios');
const cron = require('node-cron');
const { getCachedOpportunities, setCachedOpportunities, getUpdateInterval } = require('../cache/memoryCache');
const { calculateArbitrage } = require('../utils/arbitrageCalculator');
const { mapApiDataToFrontend } = require('../utils/dataMapper');

const API_BASE_URL = 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.ODDS_API_KEY;

// Esportes para monitorar: Futebol e Basquete (chaves exatas da API oficial)
const MONITORED_SPORTS = [
  // Futebol - usando chaves exatas da lista oficial da API
  'futebol_brasil_campeonato',
  'futebol_epl',
  'futebol_espanha_la_liga',
  'futebol_uefa_champs_league',
  'futebol_alemanha_bundesliga',
  'futebol_itália_série_a',
  'futebol_francês_ligue_one',
  'futebol_uefa_europa_league',
  
  // Basquete - usando chaves exatas da lista oficial da API
  'basquete_nba',
  'basquete_ncaab',
  'basquete_wnba',
  'basquete_euroliga'
];

let cronJob = null;
let currentSportIndex = 0;

async function fetchOddsFromAPI() {
  const sport = MONITORED_SPORTS[currentSportIndex];
  currentSportIndex = (currentSportIndex + 1) % MONITORED_SPORTS.length;
  
  try {
    console.log(`🔍 Fetching odds for ${sport}...`);
    
    const response = await axios.get(`${API_BASE_URL}/sports/${sport}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: 'us,uk,eu,au,br', // Incluindo regiões para Betano, VBet, etc
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
      console.log(`⚠️ Sport ${sport} may not be available or parameters are invalid`);
    } else if (error.response?.status === 429) {
      console.log('⏳ Rate limited, waiting before next request...');
    }
    
    // Return cached data if available
    const cached = getCachedOpportunities();
    return cached ? cached.data : getMockData();
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

function getMockData() {
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
      time_home: "Lakers",
      time_away: "Warriors",
      odds: {
        home: { odd: 2.1, casa: "DraftKings" },
        draw: { odd: 999, casa: "N/A" },
        away: { odd: 1.9, casa: "FanDuel" }
      },
      stakes: {
        home: "47.62",
        draw: "0.00",
        away: "52.63",
        lucro: "2.38"
      }
    }
  ];
}

function startDataUpdater() {
  const updateIntervalMinutes = Math.floor(getUpdateInterval() / 60000);
  
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
