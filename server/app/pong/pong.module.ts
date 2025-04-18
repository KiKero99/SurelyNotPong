import { Module } from '@nestjs/common';
import { PongGateway } from './gateways/pong/pong.gateway';
import { GameplayManagerService } from './services/gameplay-manager/gameplay-manager.service';
import { MatchFactoryService } from './services/match-factory/match-factory.service';
import { RoomService } from './services/room/room.service';

@Module({
    providers: [
        PongGateway,
        GameplayManagerService,
        MatchFactoryService,
        RoomService,
    ]
})
export class PongModule {}
