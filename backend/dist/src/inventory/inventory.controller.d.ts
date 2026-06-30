import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getProducts(storeId: string): Promise<{
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
    }[]>;
    receiveStock(body: {
        storeId: string;
        productId: string;
        quantity: number;
        staffId?: string;
        batchNo?: string;
    }): Promise<{
        id: string;
        storeId: string;
        productId: string;
        batchNo: string | null;
        expiryDate: Date | null;
        onHandQty: number;
        reservedQty: number;
        blockedQty: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    manualAdjustment(body: {
        storeId: string;
        productId: string;
        quantityChange: number;
        reason: string;
        staffId: string;
    }): Promise<{
        id: string;
        storeId: string;
        productId: string;
        batchNo: string | null;
        expiryDate: Date | null;
        onHandQty: number;
        reservedQty: number;
        blockedQty: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAvailableStock(productId: string, storeId: string): Promise<{
        available: number;
        onHand: number;
        reserved: number;
        blocked: number;
    }>;
    getMovementHistory(storeId: string, productId?: string): Promise<({
        product: {
            name: string;
        };
        staff: {
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
        } | null;
    } & {
        id: string;
        storeId: string;
        productId: string;
        createdAt: Date;
        inventoryId: string;
        type: import(".prisma/client").$Enums.MovementType;
        quantityChange: number;
        sourceType: string | null;
        sourceId: string | null;
        reason: string | null;
        staffId: string | null;
    })[]>;
}
