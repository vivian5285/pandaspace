import React from 'react';

const Strategies: React.FC = () => {
  return (
    <div className="strategies-page">
      <h1>Trading Strategies</h1>
      
      <div className="strategies-grid">
        {/* 网格交易策略 */}
        <div className="strategy-card">
          <h2>Grid Trading</h2>
          <div className="strategy-status">
            <span className="status active">Active</span>
            <span className="performance">P/L: $0.00</span>
          </div>
          <div className="strategy-config">
            <h3>Configuration</h3>
            <div className="config-item">
              <label>Grid Levels</label>
              <span>10</span>
            </div>
            <div className="config-item">
              <label>Grid Size</label>
              <span>$100</span>
            </div>
            <div className="config-item">
              <label>Upper Price</label>
              <span>$50,000</span>
            </div>
            <div className="config-item">
              <label>Lower Price</label>
              <span>$40,000</span>
            </div>
          </div>
          <div className="strategy-actions">
            <button className="btn-pause">Pause</button>
            <button className="btn-edit">Edit</button>
          </div>
        </div>

        {/* DCA策略 */}
        <div className="strategy-card">
          <h2>DCA Strategy</h2>
          <div className="strategy-status">
            <span className="status paused">Paused</span>
            <span className="performance">P/L: $0.00</span>
          </div>
          <div className="strategy-config">
            <h3>Configuration</h3>
            <div className="config-item">
              <label>Investment Amount</label>
              <span>$100</span>
            </div>
            <div className="config-item">
              <label>Frequency</label>
              <span>Daily</span>
            </div>
            <div className="config-item">
              <label>Target Asset</label>
              <span>BTC/USDT</span>
            </div>
          </div>
          <div className="strategy-actions">
            <button className="btn-start">Start</button>
            <button className="btn-edit">Edit</button>
          </div>
        </div>
      </div>

      <button className="btn-create-strategy">
        Create New Strategy
      </button>
    </div>
  );
};

export default Strategies; 