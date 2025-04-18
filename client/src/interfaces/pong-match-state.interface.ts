import { MatchStatus } from "../enums/match-status.enum";
import { Ball } from "./ball.interface";
import { Racket } from "./racket.interface";

export interface PongMatchState {
    status: MatchStatus;
    player1: Racket;
    player2: Racket;
    ball: Ball;
    scoreToAcheive: number;
}
