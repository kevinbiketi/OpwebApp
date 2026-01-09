import React, { useState } from 'react';
import { getSystemRecommendations, calculateFeedAmount, calculateStockingDensity, getGrowthRate } from '../../utils/farmingSystemUtils';
import './FarmingSystemInfo.css';

const FarmingSystemInfo = ({ farmingSystem, batchData = null }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const recommendations = getSystemRecommendations(farmingSystem);
  const growthRate = getGrowthRate(farmingSystem);

  const calculateFeed = () => {
    if (!batchData || !batchData.quantity || !batchData.avgWeight) {
      return null;
    }
    return calculateFeedAmount(
      parseInt(batchData.quantity),
      parseFloat(batchData.avgWeight) || 100,
      farmingSystem
    );
  };

  const calculateDensity = () => {
    if (!batchData || !batchData.quantity || !batchData.volume) {
      return null;
    }
    return calculateStockingDensity(
      parseInt(batchData.quantity),
      parseFloat(batchData.avgWeight) || 100,
      parseFloat(batchData.volume),
      farmingSystem
    );
  };

  const feedInfo = calculateFeed();
  const densityInfo = calculateDensity();

  return (
    <div className="farming-system-info">
      <div className="system-header">
        <h2>{recommendations.name} System</h2>
        <p className="system-description">{recommendations.description}</p>
      </div>

      <div className="system-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'water' ? 'active' : ''}
          onClick={() => setActiveTab('water')}
        >
          Water Quality
        </button>
        <button 
          className={activeTab === 'feeding' ? 'active' : ''}
          onClick={() => setActiveTab('feeding')}
        >
          Feeding
        </button>
        <button 
          className={activeTab === 'growth' ? 'active' : ''}
          onClick={() => setActiveTab('growth')}
        >
          Growth
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="info-grid">
              <div className="info-card">
                <h3>Stocking Density</h3>
                <p className="info-value">
                  {recommendations.stockingDensity.recommended} kg/m³
                </p>
                <p className="info-range">
                  Range: {recommendations.stockingDensity.min} - {recommendations.stockingDensity.max} kg/m³
                </p>
                {densityInfo && (
                  <div className={`density-status ${densityInfo.status}`}>
                    Current: {densityInfo.current} kg/m³
                    {!densityInfo.isOptimal && (
                      <span className="warning">
                        {densityInfo.status === 'low' ? ' (Below recommended)' : ' (Above recommended)'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="info-card">
                <h3>Feed Frequency</h3>
                <p className="info-value">{recommendations.feedFrequency}</p>
              </div>

              <div className="info-card">
                <h3>Water Exchange</h3>
                <p className="info-value">{recommendations.waterExchange.daily}</p>
                <p className="info-description">{recommendations.waterExchange.description}</p>
              </div>

              <div className="info-card">
                <h3>Aeration</h3>
                <p className="info-value">{recommendations.aeration}</p>
              </div>

              <div className="info-card">
                <h3>Monitoring</h3>
                <p className="info-value">{recommendations.monitoringFrequency}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'water' && (
          <div className="water-content">
            <h3>Water Quality Parameters</h3>
            <div className="water-params">
              <div className="param-item">
                <span className="param-label">Dissolved Oxygen:</span>
                <span className="param-value">{recommendations.waterQuality.dissolvedOxygen}</span>
              </div>
              <div className="param-item">
                <span className="param-label">Ammonia:</span>
                <span className="param-value">{recommendations.waterQuality.ammonia}</span>
              </div>
              <div className="param-item">
                <span className="param-label">Nitrite:</span>
                <span className="param-value">{recommendations.waterQuality.nitrite}</span>
              </div>
              <div className="param-item">
                <span className="param-label">pH:</span>
                <span className="param-value">{recommendations.waterQuality.ph}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feeding' && (
          <div className="feeding-content">
            <h3>Feeding Recommendations</h3>
            {feedInfo ? (
              <div className="feed-calculations">
                <div className="feed-card">
                  <h4>Daily Feed Amount</h4>
                  <p className="feed-amount">{feedInfo.daily} kg</p>
                </div>
                <div className="feed-card">
                  <h4>Weekly Feed Amount</h4>
                  <p className="feed-amount">{feedInfo.weekly} kg</p>
                </div>
                <div className="feed-card">
                  <h4>Monthly Feed Amount</h4>
                  <p className="feed-amount">{feedInfo.monthly} kg</p>
                </div>
              </div>
            ) : (
              <p className="no-data">Enter batch quantity and average weight to calculate feed requirements</p>
            )}
            <div className="feed-note">
              <p><strong>Note:</strong> Feed amounts are estimates based on standard feed conversion ratios. Adjust based on actual conditions and fish behavior.</p>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="growth-content">
            <h3>Expected Growth Rate</h3>
            <div className="growth-info">
              <div className="growth-card">
                <h4>Daily Growth</h4>
                <p className="growth-value">{growthRate.daily} g/day</p>
              </div>
              <div className="growth-card">
                <h4>Monthly Growth</h4>
                <p className="growth-value">{growthRate.monthly} g/month</p>
              </div>
            </div>
            <p className="growth-description">{growthRate.description}</p>
            <div className="growth-note">
              <p><strong>Note:</strong> Growth rates are approximate and vary based on species, feed quality, water conditions, and management practices.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmingSystemInfo;
