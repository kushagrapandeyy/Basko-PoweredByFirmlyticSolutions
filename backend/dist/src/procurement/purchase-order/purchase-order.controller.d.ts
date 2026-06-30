import { PurchaseOrderService } from './purchase-order.service';
import { GrnService } from '../grn/grn.service';
export declare class PurchaseOrderController {
    private poService;
    private grnService;
    constructor(poService: PurchaseOrderService, grnService: GrnService);
    createPO(body: {
        storeId: string;
        supplierId: string;
        expectedDeliveryDate: string;
        items: any[];
        notes?: string;
    }): Promise<{
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
    getStorePOs(storeId: string): Promise<({
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
    getPO(id: string): Promise<{
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
    completeGRN(id: string, body: {
        staffId: string;
        receivedItems: {
            poItemId: string;
            receivedQuantity: number;
        }[];
    }): Promise<{
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
