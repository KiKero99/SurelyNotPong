import { Injectable } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { FPS, MATCH_HEIGTH, MATCH_WIDTH, ONE_SECOND } from '@app/pong/constants/gameplay.const';
import { PongMatchState } from '@app/pong/interfaces/pong-match-state.interface';
import { MatchStatus } from '@app/pong/enums/match-status.enum';
import { Server, Socket } from 'socket.io';
import { NEXT_FRAME } from '@app/pong/constants/game-messages.const';
import { MatchFactoryService } from '../match-factory/match-factory.service';
import { JoinRequestInterface } from '@app/pong/interfaces/join-game-request.interface';
import { PongMessages } from '@common/enums/pong-messages.enum';
import { Racket } from '@app/pong/interfaces/racket.interface';
import { Ball } from '@app/pong/interfaces/ball.interface';

@Injectable()
export class GameplayManagerService {
    private gameLoopId;
    private server: Server;

    constructor (
        private readonly roomService: RoomService,
        private readonly matchFactory: MatchFactoryService
    ) {}

    setServer(server: Server) {
        this.server = server;
    }

    createRoom(ownerName: string): string {
        const roomId = this.roomService.addRoom(this.matchFactory.createMatchFactory(ownerName));
        return roomId;
    }

    joinRoom(request: JoinRequestInterface) {
        const room = this.roomService.getRoom(request.roomId);
        if (!room) return;

        const socket = this.server.sockets.sockets.get(request.ownerName);
        if(!socket) return;
        socket.join(request.roomId);

        room.player2 = this.matchFactory.createPlayer(request.ownerName, false);
        room.status = MatchStatus.STARTED;
        this.server.to(request.roomId).emit(PongMessages.GAME_STARTED, room);
    }

    handlePayerMoved(request, client: Socket){
        const room = this.roomService.getRoom(request.roomId);
        if (!room) return;
        const player = room.player1.owner === client.id ? room.player1 : room.player2;
        player.position.x = request.clampedX;
    }

    gameLoop () {
        if (this.gameLoopId) return;
        if(!this.server) return;
        this.gameLoopId = setInterval(() => {
            this.updateGames();
        }, ONE_SECOND / FPS)
    }

    private updateGames() {
        this.roomService.rooms.forEach((match: PongMatchState, roomId: string) => {
            this.updateGame(match);
            this.server.to(roomId).emit(NEXT_FRAME, match);
        });
    }

    private updateGame(room: PongMatchState) {
        if (room.status == MatchStatus.NOT_STARTED || room.status == MatchStatus.FINISHED)
            return;
        this.moveBall(room);
    }

    private updatePlayerScore(game: PongMatchState, player: Racket) {
        player.score += 1;
        game.ball = this.matchFactory.createBall();
        if (player.score >= game.scoreToAcheive) game.status = MatchStatus.FINISHED
    }

    private moveBall(game: PongMatchState) {
        const ball = game.ball;
        ball.position.x += ball.xSpeed;
        ball.position.y += ball.ySpeed;

        if (ball.position.y <= 0){
            this.updatePlayerScore(game, game.player2);
            return;
        }
        if (ball.position.y >= MATCH_HEIGTH) {
            this.updatePlayerScore(game, game.player1);
            return;
        }
        
        if (ball.position.x <= 0 || ball.position.x >= MATCH_WIDTH) ball.xSpeed *= -1;
        if (this.isBallTouchingRacket(ball, game.player1)) this.bounce(ball, game.player1);
        if (this.isBallTouchingRacket(ball, game.player2)) this.bounce(ball, game.player2);
    }

    private isBallTouchingRacket(ball: Ball, player: Racket) {
        const isBallInVerticalRange = ball.position.y >= player.position.y - 2 &&
                                  ball.position.y <= player.position.y + 2;
        
        const isBallInHorizontalRange = ball.position.x >= player.position.x - 4 && 
                                        ball.position.x <= player.position.x + 4; 

        return isBallInVerticalRange && isBallInHorizontalRange;
    }

    private bounce(ball: Ball, player: Racket) {
        const racketCenter = player.position.y;
        const racketHeight = 4; 
        const hitPosition = ball.position.y - racketCenter;

        const normalizedHitPosition = hitPosition / (racketHeight / 2);
        ball.ySpeed = normalizedHitPosition * 2;

        const randomFactor = Math.random() * 0.3 - 0.15;
        ball.ySpeed += randomFactor;
        ball.xSpeed += randomFactor;

        const speed = Math.sqrt(ball.xSpeed * ball.xSpeed + ball.ySpeed * ball.ySpeed);
        const maxSpeed = 5;
        if (speed > maxSpeed) {
            ball.xSpeed = (ball.xSpeed / speed) * maxSpeed;
            ball.ySpeed = (ball.ySpeed / speed) * maxSpeed;
        }
    }
}
