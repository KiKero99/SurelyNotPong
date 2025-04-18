import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './username-page.css';

export function UsernamePage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      navigate('/');
    }
  };

  return (
    <div className="username-page-container">
      <div className="username-card">
        <h1 className="title">🏓 Welcome to Pong</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
          />
          <button type="submit" className="submit-btn">Start Game</button>
        </form>
      </div>
    </div>
  );
}