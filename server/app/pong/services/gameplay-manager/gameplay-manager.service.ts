import { Injectable } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { FPS, MATCH_HEIGTH, MATCH_WIDTH, ONE_SECOND } from '@app/pong/constants/gameplay.const';
import { PongMatchState } from '@app/pong/interfaces/pong-match-state.interface';
import { MatchStatus } from '@app/pong/enums/match-status.enum';
import { Server } from 'socket.io';
import { NEXT_FRAME } from '@app/pong/constants/game-messages.const';
import { MatchFactoryService } from '../match-factory/match-factory.service';
import { JoinRequestInterface } from '@app/pong/interfaces/join-game-request.interface';

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

        room.player2 = this.matchFactory.createPlayer(request.ownerName, false);
        room.status = MatchStatus.STARTED;
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

    private moveBall(game: PongMatchState) {
        const ball = game.ball;
        ball.position.x += ball.xSpeed;
        ball.position.y += ball.ySpeed;

        if (ball.position.y <= 0 || ball.position.y >= MATCH_HEIGTH) ball.ySpeed *= -1;
        if (ball.position.x <= 0 || ball.position.x >= MATCH_WIDTH) ball.xSpeed *= -1;
    }
}
