import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class HostelGateway {
  @WebSocketServer()
  server;

  handleConnection(client) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcastComplaintUpdate(complaint) {
    this.server.emit('complaint_update', complaint);
  }

  broadcastVisitorUpdate(visitor) {
    this.server.emit('visitor_update', visitor);
  }

  broadcastAllocationUpdate(allocation) {
    this.server.emit('allocation_update', allocation);
  }

  broadcastAttendanceUpdate(attendance) {
    this.server.emit('attendance_update', attendance);
  }

  broadcastNewBroadcast(broadcast) {
    this.server.emit('new_broadcast', broadcast);
  }
}
