import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

   afterInit() {
    (global as any).io = this.server;
  }

  handleConnection(client: Socket) {
    // Optionally authenticate here
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    if (userId) {
      client.join(userId);
    }
  }
}
