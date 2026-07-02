import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeliveryService } from './delivery.service';
export declare class DeliveryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private deliveryService;
    server: Server;
    private readonly logger;
    constructor(deliveryService: DeliveryService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinOrder(client: Socket, data: {
        orderId: string;
    }): {
        event: string;
        room: string;
    };
    handleLocationUpdate(client: Socket, data: {
        orderId: string;
        lat: number;
        lng: number;
        staffId: string;
    }): Promise<void>;
    broadcastStatusChange(orderId: string, status: string): void;
    handleOrderStatusChanged(event: {
        orderId: string;
        status: string;
        customerId: string;
    }): void;
}
