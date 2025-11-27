import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import './styles.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div style={{ textAlign: 'center', color: '#a1a1aa' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isLogin ? (
          <Login onSuccess={handleAuthSuccess} onSwitch={() => setIsLogin(false)} />
        ) : (
          <Signup onSuccess={handleAuthSuccess} onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

export default App;