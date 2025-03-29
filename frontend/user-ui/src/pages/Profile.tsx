import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Account Settings</h2>
          <div className="settings-form">
            <p>Profile settings coming soon...</p>
          </div>
        </div>
        <div className="profile-section">
          <h2>Security</h2>
          <div className="security-settings">
            <p>Security settings coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 