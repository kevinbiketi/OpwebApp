/**
 * Farming System Utilities
 * Provides calculations and recommendations for different farming systems
 */

export const FARMING_SYSTEMS = {
  'super-intensive': {
    name: 'Super Intensive',
    description: 'Very high stocking density with advanced water treatment and aeration',
    stockingDensity: {
      min: 50, // kg/m³
      max: 100,
      recommended: 75
    },
    feedConversionRatio: {
      min: 1.2,
      max: 1.5,
      recommended: 1.35
    },
    waterExchange: {
      daily: '100-200%',
      description: 'Continuous water exchange with advanced filtration'
    },
    aeration: 'Required - High intensity',
    waterQuality: {
      dissolvedOxygen: '> 6 mg/L',
      ammonia: '< 0.5 mg/L',
      nitrite: '< 0.1 mg/L',
      ph: '7.0 - 8.5'
    },
    feedFrequency: '4-6 times daily',
    monitoringFrequency: 'Daily - Multiple times'
  },
  'intensive': {
    name: 'Intensive',
    description: 'High stocking density with regular water management',
    stockingDensity: {
      min: 20,
      max: 50,
      recommended: 35
    },
    feedConversionRatio: {
      min: 1.3,
      max: 1.7,
      recommended: 1.5
    },
    waterExchange: {
      daily: '50-100%',
      description: 'Regular water exchange with basic filtration'
    },
    aeration: 'Required - Moderate intensity',
    waterQuality: {
      dissolvedOxygen: '> 5 mg/L',
      ammonia: '< 1.0 mg/L',
      nitrite: '< 0.2 mg/L',
      ph: '6.5 - 8.5'
    },
    feedFrequency: '3-4 times daily',
    monitoringFrequency: 'Daily'
  },
  'semi-intensive': {
    name: 'Semi-Intensive',
    description: 'Moderate stocking density with supplemental feeding',
    stockingDensity: {
      min: 5,
      max: 20,
      recommended: 12
    },
    feedConversionRatio: {
      min: 1.5,
      max: 2.0,
      recommended: 1.75
    },
    waterExchange: {
      daily: '10-30%',
      description: 'Periodic water exchange'
    },
    aeration: 'Optional - Low intensity',
    waterQuality: {
      dissolvedOxygen: '> 4 mg/L',
      ammonia: '< 2.0 mg/L',
      nitrite: '< 0.5 mg/L',
      ph: '6.0 - 8.5'
    },
    feedFrequency: '2-3 times daily',
    monitoringFrequency: '2-3 times per week'
  },
  'extensive': {
    name: 'Extensive',
    description: 'Low stocking density relying on natural food sources',
    stockingDensity: {
      min: 0.5,
      max: 5,
      recommended: 2
    },
    feedConversionRatio: {
      min: 2.0,
      max: 3.5,
      recommended: 2.5
    },
    waterExchange: {
      daily: 'Natural flow',
      description: 'Natural water flow or minimal exchange'
    },
    aeration: 'Not required',
    waterQuality: {
      dissolvedOxygen: '> 3 mg/L',
      ammonia: '< 3.0 mg/L',
      nitrite: '< 1.0 mg/L',
      ph: '6.0 - 9.0'
    },
    feedFrequency: '1-2 times daily or supplemental',
    monitoringFrequency: 'Weekly'
  }
};

/**
 * Calculate recommended feed amount based on farming system
 * @param {number} quantity - Number of fish
 * @param {number} avgWeight - Average weight in grams
 * @param {string} farmingSystem - Farming system type
 * @param {number} feedPercentage - Percentage of body weight (optional, uses system default)
 * @returns {number} Recommended feed amount in kg
 */
export const calculateFeedAmount = (quantity, avgWeight, farmingSystem, feedPercentage = null) => {
  const system = FARMING_SYSTEMS[farmingSystem] || FARMING_SYSTEMS['semi-intensive'];
  
  // Default feed percentage based on system (as % of body weight per day)
  const defaultFeedPercentages = {
    'super-intensive': 3.5, // Higher feeding rate
    'intensive': 3.0,
    'semi-intensive': 2.5,
    'extensive': 1.5 // Lower feeding rate
  };
  
  const feedPercent = feedPercentage || defaultFeedPercentages[farmingSystem] || 2.5;
  const totalWeightKg = (quantity * avgWeight) / 1000; // Convert to kg
  const dailyFeedKg = (totalWeightKg * feedPercent) / 100;
  
  return {
    daily: parseFloat(dailyFeedKg.toFixed(2)),
    weekly: parseFloat((dailyFeedKg * 7).toFixed(2)),
    monthly: parseFloat((dailyFeedKg * 30).toFixed(2))
  };
};

/**
 * Calculate recommended stocking density
 * @param {number} quantity - Number of fish
 * @param {number} avgWeight - Average weight in grams
 * @param {number} volume - Water volume in cubic meters
 * @param {string} farmingSystem - Farming system type
 * @returns {object} Stocking density information
 */
export const calculateStockingDensity = (quantity, avgWeight, volume, farmingSystem) => {
  const system = FARMING_SYSTEMS[farmingSystem] || FARMING_SYSTEMS['semi-intensive'];
  const totalWeightKg = (quantity * avgWeight) / 1000;
  const currentDensity = volume > 0 ? totalWeightKg / volume : 0;
  
  const isOptimal = currentDensity >= system.stockingDensity.min && 
                    currentDensity <= system.stockingDensity.max;
  
  return {
    current: parseFloat(currentDensity.toFixed(2)),
    recommended: system.stockingDensity.recommended,
    min: system.stockingDensity.min,
    max: system.stockingDensity.max,
    isOptimal,
    status: isOptimal ? 'optimal' : 
            (currentDensity < system.stockingDensity.min ? 'low' : 'high')
  };
};

/**
 * Get water quality recommendations for a farming system
 * @param {string} farmingSystem - Farming system type
 * @returns {object} Water quality parameters
 */
export const getWaterQualityRecommendations = (farmingSystem) => {
  const system = FARMING_SYSTEMS[farmingSystem] || FARMING_SYSTEMS['semi-intensive'];
  return system.waterQuality;
};

/**
 * Get system-specific recommendations
 * @param {string} farmingSystem - Farming system type
 * @returns {object} System recommendations
 */
export const getSystemRecommendations = (farmingSystem) => {
  const system = FARMING_SYSTEMS[farmingSystem] || FARMING_SYSTEMS['semi-intensive'];
  return {
    name: system.name,
    description: system.description,
    stockingDensity: system.stockingDensity,
    feedFrequency: system.feedFrequency,
    waterExchange: system.waterExchange,
    aeration: system.aeration,
    monitoringFrequency: system.monitoringFrequency,
    waterQuality: system.waterQuality
  };
};

/**
 * Calculate expected growth rate based on farming system
 * @param {string} farmingSystem - Farming system type
 * @param {string} species - Fish species (optional)
 * @returns {object} Growth rate information
 */
export const getGrowthRate = (farmingSystem, species = 'general') => {
  // Growth rates vary by system (grams per day, approximate)
  const growthRates = {
    'super-intensive': {
      daily: 2.5, // Higher growth due to optimal conditions
      monthly: 75,
      description: 'Fast growth due to optimal conditions and high-quality feed'
    },
    'intensive': {
      daily: 2.0,
      monthly: 60,
      description: 'Good growth with proper management'
    },
    'semi-intensive': {
      daily: 1.5,
      monthly: 45,
      description: 'Moderate growth with supplemental feeding'
    },
    'extensive': {
      daily: 0.8,
      monthly: 24,
      description: 'Slower growth relying on natural food sources'
    }
  };
  
  return growthRates[farmingSystem] || growthRates['semi-intensive'];
};

/**
 * Calculate production cost estimates
 * @param {string} farmingSystem - Farming system type
 * @param {number} quantity - Number of fish
 * @param {number} feedPricePerKg - Feed price per kg
 * @returns {object} Cost estimates
 */
export const calculateProductionCosts = (farmingSystem, quantity, feedPricePerKg = 1.5) => {
  const system = FARMING_SYSTEMS[farmingSystem] || FARMING_SYSTEMS['semi-intensive'];
  const avgWeight = 500; // Assume 500g average for calculation
  const feedAmounts = calculateFeedAmount(quantity, avgWeight, farmingSystem);
  
  const dailyFeedCost = feedAmounts.daily * feedPricePerKg;
  const monthlyFeedCost = feedAmounts.monthly * feedPricePerKg;
  
  // Additional costs vary by system
  const additionalCosts = {
    'super-intensive': {
      aeration: monthlyFeedCost * 0.3, // 30% of feed cost
      waterTreatment: monthlyFeedCost * 0.2,
      monitoring: monthlyFeedCost * 0.1
    },
    'intensive': {
      aeration: monthlyFeedCost * 0.2,
      waterTreatment: monthlyFeedCost * 0.1,
      monitoring: monthlyFeedCost * 0.05
    },
    'semi-intensive': {
      aeration: monthlyFeedCost * 0.05,
      waterTreatment: monthlyFeedCost * 0.05,
      monitoring: monthlyFeedCost * 0.02
    },
    'extensive': {
      aeration: 0,
      waterTreatment: monthlyFeedCost * 0.02,
      monitoring: monthlyFeedCost * 0.01
    }
  };
  
  const additional = additionalCosts[farmingSystem] || additionalCosts['semi-intensive'];
  const totalMonthlyCost = monthlyFeedCost + 
                           additional.aeration + 
                           additional.waterTreatment + 
                           additional.monitoring;
  
  return {
    feed: {
      daily: parseFloat(dailyFeedCost.toFixed(2)),
      monthly: parseFloat(monthlyFeedCost.toFixed(2))
    },
    additional,
    total: {
      daily: parseFloat((totalMonthlyCost / 30).toFixed(2)),
      monthly: parseFloat(totalMonthlyCost.toFixed(2))
    }
  };
};
