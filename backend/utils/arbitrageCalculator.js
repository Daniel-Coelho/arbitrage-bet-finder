
function calculateArbitrage(homeOdd, drawOdd, awayOdd) {
  const homeImplied = 1 / homeOdd;
  const awayImplied = 1 / awayOdd;
  
  // Para esportes sem empate (drawOdd = 999), ignorar o empate
  let drawImplied = 0;
  let totalImplied = homeImplied + awayImplied;
  
  if (drawOdd && drawOdd < 999) {
    drawImplied = 1 / drawOdd;
    totalImplied = homeImplied + drawImplied + awayImplied;
  }
  
  const hasArbitrage = totalImplied < 1;
  const margin = (1 - totalImplied) * 100;
  
  if (!hasArbitrage) {
    return {
      hasArbitrage: false,
      profit: 0,
      stakes: { home: 0, draw: 0, away: 0 }
    };
  }
  
  // Calculate optimal stakes for R$ 100 total investment
  const totalStake = 100;
  
  let homeStake, drawStake, awayStake;
  
  if (drawImplied === 0) {
    // Esporte sem empate (basquete, e-sports)
    homeStake = (homeImplied / totalImplied) * totalStake;
    drawStake = 0;
    awayStake = (awayImplied / totalImplied) * totalStake;
  } else {
    // Esporte com empate (futebol)
    homeStake = (homeImplied / totalImplied) * totalStake;
    drawStake = (drawImplied / totalImplied) * totalStake;
    awayStake = (awayImplied / totalImplied) * totalStake;
  }
  
  // Calculate guaranteed profit
  const profit = margin;
  
  return {
    hasArbitrage: true,
    profit: parseFloat(profit.toFixed(2)),
    stakes: {
      home: parseFloat(homeStake.toFixed(2)),
      draw: parseFloat(drawStake.toFixed(2)),
      away: parseFloat(awayStake.toFixed(2))
    }
  };
}

module.exports = {
  calculateArbitrage
};
