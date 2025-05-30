
const express = require('express');
const { getArbitrageOpportunities } = require('../services/oddsService');
const { getQuotaInfo } = require('../cache/memoryCache');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('📡 Odds endpoint called');
    
    const result = await getArbitrageOpportunities();
    const quotaInfo = getQuotaInfo();
    
    res.json(result.opportunities);
    
    console.log(`📤 Returned ${result.opportunities.length} opportunities ${result.fromCache ? '(cached)' : '(fresh)'}`);
    
  } catch (error) {
    console.error('❌ Error in odds endpoint:', error.message);
    
    res.status(500).json({
      error: 'Failed to fetch arbitrage opportunities',
      message: error.message
    });
  }
});

module.exports = router;
