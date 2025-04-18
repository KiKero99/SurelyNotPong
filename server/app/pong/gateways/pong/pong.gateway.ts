import { GameplayManagerService } from '@app/pong/services/gameplay-manager/gameplay-manager.service';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PongMessages } from '@common/enums/pong-messages.enum';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PongGateway {
  @WebSocketServer() private readonly server: Server;

  constructor (private readonly gameplayManager: GameplayManagerService) {
    this.gameplayManager.setServer(this.server);
    this.gameplayManager.gameLoop();
  }
  
  @SubscribeMessage(PongMessages.CREATE_ROOM)
  createPongRoom(client: Socket) {
    const roomId: string = this.gameplayManager.createRoom(client.id);
    if (!roomId) return;

    client.join(roomId);
    this.server.to(client.id).emit(PongMessages.GAME_CREATED, roomId);
  }

  @SubscribeMessage(PongMessages.JOIN_ROOM)
  joinRoom(client: Socket, id: string) {
    this.gameplayManager.joinRoom({ownerName: client.id, roomId: id});
  }
}
