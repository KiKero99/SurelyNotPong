import './home.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import socketService from '@app/services/socket-service.ts';
import { PongMessages } from '@common/enums/pong-messages.enum.ts'
import { PongMatchState } from '../../interfaces/pong-match-state.interface';

export function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setLoadingState] = useState(false);
  const [joinMode, setJoinMode] = useState(false);
  const [roomInput, setRoomInput] = useState('');
  const [roomId, setRoomId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const savedName = sessionStorage.getItem('username');
    if (!savedName) {
      navigate('/');
    } else {
      setUsername(savedName);
      setLoadingState(false);
    }

    socketService.connect();
  }, [navigate]);

  const createGame = () => {
    socketService.off(PongMessages.GAME_CREATED);
    socketService.off(PongMessages.GAME_STARTED);
    socketService.emit(PongMessages.CREATE_ROOM);
    socketService.on(PongMessages.GAME_CREATED, (roomId: string) => {
      if (!roomId) return;
      setLoadingState(true);
      setRoomId(roomId);

      socketService.on(PongMessages.GAME_STARTED, (gameState: PongMatchState) => {
        if (!gameState) return;
        navigate('/game', { state: { gameState, roomId: roomId } });
      });
    });
  };

  const handleJoin = () => {
    if (roomInput) {
      socketService.off(PongMessages.GAME_STARTED);
      socketService.emit(PongMessages.JOIN_ROOM, roomInput.trim());
      socketService.on(PongMessages.GAME_STARTED, (gameState: PongMatchState) => {
        if (!gameState) return;
        navigate('/game', { state: { gameState, roomId: roomInput } });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="home-page-container">
        <h1>🏓 SurelyNotPong</h1>
        <div className="username">Welcome, {username}!</div>
        <p>Room ID: <strong>{roomId}</strong></p>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="home-page-container">
      <h1>🏓 SurelyNotPong</h1>
      <div className="username">Welcome, {username}!</div>

      {joinMode ? (
        <>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            className="room-input"
          />
          <button onClick={handleJoin}>Enter</button>
          <button onClick={() => setJoinMode(false)}>Back</button>
        </>
      ) : (
        <>
          <button onClick={createGame}>Create Game</button>
          <button onClick={() => setJoinMode(true)}>Join Game</button>
        </>
      )}
    </div>
  );
}