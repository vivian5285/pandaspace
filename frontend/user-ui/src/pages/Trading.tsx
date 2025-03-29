import React from 'react';

const Trading: React.FC = () => {
  return (
    <div className="trading-page">
      <h1>Trading Dashboard</h1>
      <div className="trading-content">
        <div className="trading-panel">
          <h2>Market Overview</h2>
          <div className="market-info">
            <p>Loading market data...</p>
          </div>
        </div>
        <div className="trading-panel">
          <h2>Order Form</h2>
          <div className="order-form">
            <p>Order form coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading; 