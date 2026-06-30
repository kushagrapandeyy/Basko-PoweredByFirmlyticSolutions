export declare class NotificationsService {
    private readonly logger;
    handlePurchaseOrderCreated(po: any): void;
    handleLowStock(event: {
        storeId: string;
        productId: string;
        onHandQty: number;
    }): void;
}
