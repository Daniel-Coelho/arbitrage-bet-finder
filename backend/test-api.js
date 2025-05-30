
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.ODDS_API_KEY;
const API_BASE_URL = 'https://api.the-odds-api.com/v4';

async function testOddsAPI() {
  console.log('🧪 Testing The Odds API connection...');
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 8)}...`);
  
  try {
    // Test 1: Get sports list
    console.log('\n📋 Test 1: Getting ALL available sports...');
    const sportsResponse = await axios.get(`${API_BASE_URL}/sports`, {
      params: { apiKey: API_KEY }
    });
    
    console.log(`✅ Found ${sportsResponse.data.length} total sports`);
    
    // Mostrar TODOS os esportes disponíveis para debug
    console.log('\n🔍 All available sports:');
    sportsResponse.data.forEach(sport => {
      if (sport.active) {
        console.log(`   ✅ ${sport.key} - ${sport.title} - ${sport.group}`);
      }
    });
    
    // Filtrar esportes de futebol e basquete disponíveis
    const footballSports = sportsResponse.data.filter(sport => 
      (sport.group === 'Soccer' || sport.group === 'Football') && sport.active
    );
    
    const basketballSports = sportsResponse.data.filter(sport => 
      sport.group === 'Basketball' && sport.active
    );
    
    console.log(`\n⚽ Available Soccer/Football leagues: ${footballSports.length}`);
    footballSports.forEach(sport => {
      console.log(`   - ${sport.key}: ${sport.title}`);
    });
    
    console.log(`\n🏀 Available Basketball leagues: ${basketballSports.length}`);
    basketballSports.forEach(sport => {
      console.log(`   - ${sport.key}: ${sport.title}`);
    });
    
    // Test 2: Testar algumas ligas específicas
    const testSports = [
      ...footballSports.slice(0, 3), // Primeiras 3 ligas de futebol
      ...basketballSports.slice(0, 2)  // Primeiras 2 ligas de basquete
    ];
    
    console.log(`\n🎯 Testing odds for ${testSports.length} sports...`);
    
    for (const sport of testSports) {
      try {
        console.log(`\n🔍 Testing ${sport.key} (${sport.title})...`);
        const oddsResponse = await axios.get(`${API_BASE_URL}/sports/${sport.key}/odds`, {
          params: {
            apiKey: API_KEY,
            regions: 'us,uk,eu,au',
            markets: 'h2h',
            oddsFormat: 'decimal'
          }
        });
        
        console.log(`✅ ${sport.key}: ${oddsResponse.data.length} games found`);
        console.log(`   Quota remaining: ${oddsResponse.headers['x-requests-remaining']}`);
        
        if (oddsResponse.data.length > 0) {
          const game = oddsResponse.data[0];
          console.log(`   Sample: ${game.home_team} vs ${game.away_team}`);
          console.log(`   Bookmakers: ${game.bookmakers.length}`);
        }
        
      } catch (error) {
        if (error.response?.status === 422) {
          console.log(`❌ ${sport.key}: Parameters invalid (422)`);
        } else {
          console.log(`⚠️ ${sport.key}: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 API test completed!');
    
  } catch (error) {
    console.error('\n❌ API test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testOddsAPI();
