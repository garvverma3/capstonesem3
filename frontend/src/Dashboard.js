import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-simple">
      <div className="success-card">
        <h1>Login Successful!</h1>
        <p>Welcome back, {user.name}</p>
        <button onClick={onLogout} className="logout-simple">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;