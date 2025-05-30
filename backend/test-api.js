
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.ODDS_API_KEY;
const API_BASE_URL = 'https://api.the-odds-api.com/v4';

async function testOddsAPI() {
  console.log('🧪 Testing The Odds API connection...');
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 8)}...`);
  
  try {
    // Test 1: Get sports list
    console.log('\n📋 Test 1: Getting sports list...');
    const sportsResponse = await axios.get(`${API_BASE_URL}/sports`, {
      params: { apiKey: API_KEY }
    });
    
    // Filtrar esportes usando chaves corretas
    const targetSports = sportsResponse.data.filter(sport => 
      (sport.key.includes('soccer_') || 
       sport.key.includes('basketball_')) && 
      sport.active
    );
    
    console.log(`✅ Found ${targetSports.length} active target sports:`);
    
    const categories = {
      soccer: targetSports.filter(s => s.key.includes('soccer_')),
      basketball: targetSports.filter(s => s.key.includes('basketball_'))
    };
    
    console.log(`   ⚽ Soccer: ${categories.soccer.length} leagues`);
    console.log(`   🏀 Basketball: ${categories.basketball.length} leagues`);
    
    // Test 2: Get odds for different sport types
    for (const [category, sports] of Object.entries(categories)) {
      if (sports.length > 0) {
        console.log(`\n🎯 Test 2.${category}: Getting odds for ${category}...`);
        const sport = sports[0];
        
        try {
          const oddsResponse = await axios.get(`${API_BASE_URL}/sports/${sport.key}/odds`, {
            params: {
              apiKey: API_KEY,
              regions: 'us,uk,eu,au,br', // Incluindo mais regiões para cobrir Betano, VBet, etc
              markets: 'h2h',
              oddsFormat: 'decimal'
            }
          });
          
          console.log(`✅ Odds fetched for ${sport.title}:`);
          console.log(`   - Games found: ${oddsResponse.data.length}`);
          console.log(`   - Quota remaining: ${oddsResponse.headers['x-requests-remaining']}`);
          
          if (oddsResponse.data.length > 0) {
            const game = oddsResponse.data[0];
            console.log(`   - Sample game: ${game.home_team} vs ${game.away_team}`);
            console.log(`   - Bookmakers: ${game.bookmakers.length}`);
            
            // Mostrar casas de apostas encontradas para debug
            const bookmakers = game.bookmakers.map(b => b.title).join(', ');
            console.log(`   - Available bookmakers: ${bookmakers}`);
          }
        } catch (error) {
          if (error.response?.status === 422) {
            console.log(`⚠️ Sport ${sport.key} parameters invalid or not available`);
          } else {
            console.log(`⚠️ No data available for ${sport.title}: ${error.message}`);
          }
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
