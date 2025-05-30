
const express = require('express');
const { getUpdateInterval, setUpdateInterval } = require('../cache/memoryCache');
const { restartDataUpdater } = require('../services/oddsService');

const router = express.Router();

router.get('/interval', (req, res) => {
  const intervalMs = getUpdateInterval();
  const intervalMinutes = Math.floor(intervalMs / 60000);
  
  res.json({
    intervalo: intervalMinutes
  });
});

router.post('/interval', (req, res) => {
  try {
    const { minutos } = req.body;
    
    if (!minutos || minutos < 1 || minutos > 60) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Intervalo deve ser entre 1 e 60 minutos'
      });
    }
    
    const intervalMs = minutos * 60 * 1000;
    setUpdateInterval(intervalMs);
    
    // Restart the data updater with new interval
    restartDataUpdater();
    
    console.log(`⚙️ Update interval changed to ${minutos} minutes`);
    
    res.json({
      sucesso: true,
      intervalo: minutos
    });
    
  } catch (error) {
    console.error('❌ Error updating interval:', error.message);
    
    res.status(500).json({
      sucesso: false,
      erro: 'Falha ao atualizar intervalo'
    });
  }
});

module.exports = router;
