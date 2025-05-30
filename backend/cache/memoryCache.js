
let cache = {
  opportunities: [],
  lastUpdated: null,
  quota: { remaining: null, used: null }
};

let cacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
  updateInterval: 10 * 60 * 1000 // 10 minutes in milliseconds
};

function initializeCache() {
  console.log('💾 Memory cache initialized');
}

function getCachedOpportunities() {
  const now = Date.now();
  const lastUpdate = cache.lastUpdated ? new Date(cache.lastUpdated).getTime() : 0;
  
  if (now - lastUpdate < cacheConfig.ttl && cache.opportunities.length > 0) {
    console.log('📦 Returning cached data');
    return {
      data: cache.opportunities,
      fromCache: true,
      lastUpdated: cache.lastUpdated
    };
  }
  
  return null;
}

function setCachedOpportunities(opportunities, quotaInfo = {}) {
  cache.opportunities = opportunities;
  cache.lastUpdated = new Date().toISOString();
  cache.quota = quotaInfo;
  
  console.log(`💾 Cache updated with ${opportunities.length} opportunities`);
}

function getUpdateInterval() {
  return cacheConfig.updateInterval;
}

function setUpdateInterval(intervalMs) {
  cacheConfig.updateInterval = intervalMs;
  console.log(`⏱️ Update interval changed to ${intervalMs / 60000} minutes`);
}

function getQuotaInfo() {
  return cache.quota;
}

module.exports = {
  initializeCache,
  getCachedOpportunities,
  setCachedOpportunities,
  getUpdateInterval,
  setUpdateInterval,
  getQuotaInfo
};
