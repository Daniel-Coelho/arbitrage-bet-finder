
function mapApiDataToFrontend(gameData) {
  const { home_team, away_team, bestOdds, arbitrage } = gameData;
  
  return {
    time_home: home_team,
    time_away: away_team,
    odds: {
      home: {
        odd: bestOdds.home.odd,
        casa: bestOdds.home.bookmaker
      },
      draw: {
        odd: bestOdds.draw.odd,
        casa: bestOdds.draw.bookmaker
      },
      away: {
        odd: bestOdds.away.odd,
        casa: bestOdds.away.bookmaker
      }
    },
    stakes: {
      home: arbitrage.stakes.home.toFixed(2),
      draw: arbitrage.stakes.draw.toFixed(2),
      away: arbitrage.stakes.away.toFixed(2),
      lucro: arbitrage.profit.toFixed(2)
    }
  };
}

module.exports = {
  mapApiDataToFrontend
};
