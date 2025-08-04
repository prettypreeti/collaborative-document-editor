import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h1>Welcome to Collaborative Editor</h1>
          <p>Enter your name to start collaborating</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Your Name:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={!username.trim()}>
            Start Editing
          </button>
        </form>
        
        <div className="login-features">
          <h3>Features:</h3>
          <ul>
            <li>✨ Real-time collaboration</li>
            <li>👥 See who's online</li>
            <li>📝 Multiple documents</li>
            <li>💾 Auto-save functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 