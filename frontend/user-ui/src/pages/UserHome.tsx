import React from 'react';

const UserHome: React.FC = () => {
  return (
    <div className="user-home">
      <h1>Welcome to Panda Trade</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Account Overview</h2>
          <div className="account-info">
            <p>Balance: $0.00</p>
            <p>Open Positions: 0</p>
            <p>Total P/L: $0.00</p>
          </div>
        </div>
        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome; 