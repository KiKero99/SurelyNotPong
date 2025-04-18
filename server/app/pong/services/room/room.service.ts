import { PongMatchState } from '@app/pong/interfaces/pong-match-state.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
    private matches: Map<string, PongMatchState> = new Map();

    get rooms() {
        return this.matches;
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    addRoom(room: PongMatchState): string {
        const roomId: string = crypto.randomUUID();
        this.rooms.set(roomId, room);
        return roomId;
    }

    deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }
}
