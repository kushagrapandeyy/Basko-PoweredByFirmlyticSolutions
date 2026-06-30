import { PrismaService } from '../../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PurchaseOrderService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    createPO(storeId: string, supplierId: string, expectedDeliveryDate: Date, items: {
        productId: string;
        quantity: number;
        purchasePrice: number;
    }[], notes?: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            acceptedQuantity: number;
            receivedQuantity: number;
            purchasePrice: number;
            productId: string;
            poId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.POStatus;
        expectedDeliveryDate: Date | null;
        totalAmount: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        supplierId: string;
    }>;
    getPOs(storeId: string): Promise<({
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            contactEmail: string | null;
            contactPhone: string | null;
            categories: string | null;
            rating: number;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                storeId: string;
                name: string;
                barcode: string | null;
                internalSku: string;
                description: string | null;
                category: string | null;
                mrp: number;
                sellingPrice: number;
                purchaseCost: number | null;
                gstRate: number;
                imageUrl: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            acceptedQuantity: number;
            receivedQuantity: number;
            purchasePrice: number;
            productId: string;
            poId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.POStatus;
        expectedDeliveryDate: Date | null;
        totalAmount: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        supplierId: string;
    })[]>;
    getPOById(id: string): Promise<{
        supplier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            contactEmail: string | null;
            contactPhone: string | null;
            categories: string | null;
            rating: number;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                storeId: string;
                name: string;
                barcode: string | null;
                internalSku: string;
                description: string | null;
                category: string | null;
                mrp: number;
                sellingPrice: number;
                purchaseCost: number | null;
                gstRate: number;
                imageUrl: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            acceptedQuantity: number;
            receivedQuantity: number;
            purchasePrice: number;
            productId: string;
            poId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.POStatus;
        expectedDeliveryDate: Date | null;
        totalAmount: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        supplierId: string;
    }>;
    acceptPO(id: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            acceptedQuantity: number;
            receivedQuantity: number;
            purchasePrice: number;
            productId: string;
            poId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.POStatus;
        expectedDeliveryDate: Date | null;
        totalAmount: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        supplierId: string;
    }>;
}
