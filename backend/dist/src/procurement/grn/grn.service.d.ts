import { PrismaService } from '../../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class GrnService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    receiveGoods(poId: string, receivedItems: {
        poItemId: string;
        receivedQuantity: number;
    }[], staffId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            poId: string;
            productId: string;
            quantity: number;
            acceptedQuantity: number;
            receivedQuantity: number;
            purchasePrice: number;
        }[];
    } & {
        id: string;
        storeId: string;
        supplierId: string;
        status: import(".prisma/client").$Enums.POStatus;
        expectedDeliveryDate: Date | null;
        totalAmount: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
