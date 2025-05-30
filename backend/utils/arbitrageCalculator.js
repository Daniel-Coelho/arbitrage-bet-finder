
function calculateArbitrage(homeOdd, drawOdd, awayOdd) {
  const homeImplied = 1 / homeOdd;
  const drawImplied = 1 / drawOdd;
  const awayImplied = 1 / awayOdd;
  
  const totalImplied = homeImplied + drawImplied + awayImplied;
  
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
  const homeStake = (homeImplied / totalImplied) * totalStake;
  const drawStake = (drawImplied / totalImplied) * totalStake;
  const awayStake = (awayImplied / totalImplied) * totalStake;
  
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
