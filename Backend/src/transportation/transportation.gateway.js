import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Dependencies, Logger } from '@nestjs/common';
import { TransportationService } from './transportation.service.js';

@WebSocketGateway({
  cors: {
    origin: [
      'https://mobilegpstracker.onrender.com',
      'http://localhost:5173',
      /\.run\.pinggy-free\.link$/,
      /\.ngrok-free\.app$/,
      /\.ngrok-free\.dev$/,
      /\.ngrok\.io$/,
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["bypass-tunnel-reminder"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
})
@Dependencies(TransportationService)
export class TransportationGateway {
  constructor(transportationService) {
    this.transportationService = transportationService;
    this.logger = new Logger('TransportationGateway');
  }

  // Called automatically by NestJS socket.io adapter
  handleConnection(client) {
    this.logger.log(`🟢 Client connected: ${client.id}`);
    this.logger.log(`Transport: ${client.conn.transport.name}`);
  }

  handleDisconnect(client) {
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  @WebSocketServer()
  server;

  @SubscribeMessage('driver_location_update')
  async handleDriverLocationUpdate(client, payload) {
    this.logger.log(`Received location update from client ${client.id}: ${JSON.stringify(payload)}`);
    
    if (!payload || !payload.bus_number || payload.latitude === undefined || payload.longitude === undefined) {
      this.logger.warn(`Invalid payload received: ${JSON.stringify(payload)}`);
      return { status: 'error', message: 'Invalid payload' };
    }

    try {
      this.logger.log(`Updating DB for bus: ${payload.bus_number}`);
      await this.transportationService.updateBusLocationByNumber(
        payload.bus_number,
        payload.latitude,
        payload.longitude,
      );

      this.logger.log(`Broadcasting location update for bus: ${payload.bus_number}`);
      this.server.emit('bus_location_update', {
        bus_number: payload.bus_number,
        latitude: payload.latitude,
        longitude: payload.longitude,
        updated_at: new Date().toISOString(),
      });

      return { status: 'success' };
    } catch (error) {
      this.logger.error(`Failed to update location for bus ${payload.bus_number}: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }
}
