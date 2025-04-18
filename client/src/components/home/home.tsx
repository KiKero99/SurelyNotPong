import './home.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (!savedName) {
      navigate('/');
    } else {
      setUsername(savedName);
    }
  }, [navigate]);

  const createGame = () => {
    navigate('/create');
  };

  const joinGame = () => {
    navigate('/join');
  };

  return (
    <div className="home-page-container">
      <h1>🏓 SurelyNotPong</h1>
      <div className="username">Welcome, {username}!</div>

      <button onClick={createGame}>Create Game</button>
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
}