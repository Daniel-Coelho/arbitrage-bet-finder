
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
    
    const soccerSports = sportsResponse.data.filter(sport => 
      sport.key.includes('soccer') && sport.active
    );
    
    console.log(`✅ Found ${soccerSports.length} active soccer sports:`);
    soccerSports.slice(0, 5).forEach(sport => {
      console.log(`   - ${sport.key}: ${sport.title}`);
    });
    
    // Test 2: Get odds for a soccer sport
    if (soccerSports.length > 0) {
      console.log('\n🎯 Test 2: Getting odds for soccer...');
      const sport = soccerSports[0];
      
      const oddsResponse = await axios.get(`${API_BASE_URL}/sports/${sport.key}/odds`, {
        params: {
          apiKey: API_KEY,
          regions: 'us,uk,eu',
          markets: 'h2h',
          oddsFormat: 'decimal'
        }
      });
      
      console.log(`✅ Odds fetched for ${sport.title}:`);
      console.log(`   - Games found: ${oddsResponse.data.length}`);
      console.log(`   - Quota remaining: ${oddsResponse.headers['x-requests-remaining']}`);
      console.log(`   - Quota used: ${oddsResponse.headers['x-requests-used']}`);
      
      if (oddsResponse.data.length > 0) {
        const game = oddsResponse.data[0];
        console.log(`   - Sample game: ${game.home_team} vs ${game.away_team}`);
        console.log(`   - Bookmakers: ${game.bookmakers.length}`);
      }
    }
    
    console.log('\n🎉 API test completed successfully!');
    
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
