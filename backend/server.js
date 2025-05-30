
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const oddsRoutes = require('./routes/oddsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { initializeCache } = require('./cache/memoryCache');
const { startDataUpdater } = require('./services/oddsService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /https:\/\/.*\.lovableproject\.com$/,
    /https:\/\/.*\.lovable\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/odds', oddsRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'ArbitraGol Backend running'
  });
});

// Initialize cache and start data updater
initializeCache();
startDataUpdater();

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📊 The Odds API integration active`);
  console.log(`🔄 Auto-update enabled`);
});
