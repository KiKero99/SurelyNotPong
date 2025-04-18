import { MAX_ROOM_CODE_SIZE } from '@app/pong/constants/gameplay.const';
import { PongMatchState } from '@app/pong/interfaces/pong-match-state.interface';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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
        const roomId: string = uuidv4().replace(/\D/g, '').substring(0, MAX_ROOM_CODE_SIZE);
        this.rooms.set(roomId, room);
        return roomId;
    }

    deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }
}
