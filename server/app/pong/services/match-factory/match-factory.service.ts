import { BASIC_SCORE_TO_ACHEIVE, CREATOR_INITIAL_Y_POS, JOINER_INITIAL_Y_POS, MATCH_WIDTH } from '@app/pong/constants/gameplay.const';
import { MatchStatus } from '@app/pong/enums/match-status.enum';
import { Ball } from '@app/pong/interfaces/ball.interface';
import { PongMatchState } from '@app/pong/interfaces/pong-match-state.interface';
import { Position } from '@app/pong/interfaces/position.interface';
import { Racket } from '@app/pong/interfaces/racket.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchFactoryService {
    createMatchFactory(creatorName: string): PongMatchState{
        return {
            ball: this.createBall(),
            status: MatchStatus.NOT_STARTED,
            player1: this.createPlayer(creatorName),
            player2: undefined,
            scoreToAcheive: BASIC_SCORE_TO_ACHEIVE,
        };
    }

    createPlayer(creatorName: string, isCreator: boolean = true): Racket {
        return {
            owner: creatorName,
            score: 0,
            position: this.createPlayerInitialPosition(isCreator),
        }
    }

    private createPlayerInitialPosition(isCreator: boolean = true): Position {
        return {
            x: MATCH_WIDTH / 2 ,
            y: isCreator ? CREATOR_INITIAL_Y_POS : JOINER_INITIAL_Y_POS,
        }
    }

    private createBall(): Ball {
        return {
            position: this.createInitialBallPosition(),
            xSpeed: this.randomInitialSpeed(),
            ySpeed: this.randomInitialSpeed(),
        };
    }

    private createInitialBallPosition(): Position {
        return {
            x: MATCH_WIDTH / 2,
            y: MATCH_WIDTH / 2 ,
        };
    }

    private randomInitialSpeed(maxSpeed: number = 1) {
        return (Math.random() * 2 - 1 ) * maxSpeed;
    }
}
