import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './styles.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  if (user) {
    return (
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome back, {user.name}</h1>
        <button className="btn-secondary" onClick={() => setUser(null)}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1 className="auth-header">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
      {isLogin ? (
        <Login setUser={setUser} />
      ) : (
        <Signup setUser={setUser} />
      )}
      <div className="auth-switch">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <a 
          href="#" 
          className="auth-link"
          onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </a>
      </div>
    </div>
  );
}

export default App;