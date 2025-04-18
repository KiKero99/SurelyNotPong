import './game-page.css';
import { useEffect, useRef, useState  } from 'react';
import { PongMatchState } from '../../interfaces/pong-match-state.interface';
import { useLocation } from 'react-router-dom';
import socketService from '@app/services/socket-service.ts';
import { PongMessages } from '@common/enums/pong-messages.enum.ts'

export function GamePage() {
    const location = useLocation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const initialState = (location.state).gameState as PongMatchState;
    const roomId = (location.state).roomId as string;
    const [gameState, setGameState] = useState<PongMatchState>(initialState);

    const canvasWidth = 500;
    const canvasHeight = 500;

    useEffect(() => {
        const draw = (state: PongMatchState) => {
            if (!state || !canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            const ballX = (state.ball.position.x / 50) * canvasWidth;
            const ballY = (state.ball.position.y / 100) * canvasHeight;

            ctx.beginPath();
            ctx.arc(ballX, ballY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();

            const racketWidth = 80;
            const racketHeight = 10;

            const p1X = (state.player1.position.x / 50) * canvasWidth - racketWidth / 2;
            const p1Y = (state.player1.position.y / 100) * canvasHeight - racketHeight / 2;
            ctx.fillStyle = 'lightblue';
            ctx.fillRect(p1X, p1Y, racketWidth, racketHeight);

            const p2X = (state.player2.position.x / 50) * canvasWidth - racketWidth / 2;
            const p2Y = (state.player2.position.y / 100) * canvasHeight - racketHeight / 2;
            ctx.fillStyle = 'lightgreen';
            ctx.fillRect(p2X, p2Y, racketWidth, racketHeight);
        };

        draw(gameState);

        socketService.on(PongMessages.NEXT_FRAME, (nextState: PongMatchState) => {
            if (!nextState) return;
            console.log(nextState)
            setGameState(nextState);
            draw(nextState);         // Immediate visual update
        });

        return () => {
            socketService.off(PongMessages.NEXT_FRAME);
        };
        
    }, [gameState]);

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
    
        const x = (relativeX / canvasWidth) * 50;
    
        const clampedX = Math.max(0, Math.min(50, x));
    
        socketService.emit(PongMessages.PLAYER_MOVE, {clampedX, roomId});
    }

    if (!gameState) return <p>No game data found</p>;

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>SurelyNotPong</h1>
            <div className="score-container">
                <div className="score player1-score">
                    <span>{gameState.player1.score}</span> / {gameState.scoreToAcheive}
                </div>
                <div className="score player2-score">
                    <span>{gameState.player2.score}</span> / {gameState.scoreToAcheive}
                </div>
            </div>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseMove={handleMouseMove}
                style={{ backgroundColor: 'black', border: '2px solid white' }}
            />
        </div>
    );
}