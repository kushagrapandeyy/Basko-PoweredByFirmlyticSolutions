import { PrismaService } from '../prisma.service';
import { InventoryService } from '../inventory/inventory.service';
export declare class OrdersService {
    private prisma;
    private inventoryService;
    constructor(prisma: PrismaService, inventoryService: InventoryService);
    createOrder(storeId: string, customerId: string, items: {
        productId: string;
        quantity: number;
    }[], delivery?: {
        address: string;
        lat: number;
        lng: number;
    }, requireOtp?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    }>;
    payOrder(orderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    }>;
    pickOrder(orderId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    } | null>;
    getStoreOrders(storeId: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                storeId: string;
                barcode: string | null;
                internalSku: string;
                description: string | null;
                category: string | null;
                mrp: number;
                sellingPrice: number;
                purchaseCost: number | null;
                gstRate: number;
                imageUrl: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
        })[];
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            storeId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    })[]>;
    getOrderById(id: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                storeId: string;
                barcode: string | null;
                internalSku: string;
                description: string | null;
                category: string | null;
                mrp: number;
                sellingPrice: number;
                purchaseCost: number | null;
                gstRate: number;
                imageUrl: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            priceAtOrder: number;
            orderId: string;
        })[];
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            storeId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    }>;
    startDelivery(orderId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    }>;
    completeOrder(orderId: string, staffId: string, otp?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        customerId: string;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
    }>;
    getOrderMessages(orderId: string): Promise<({
        sender: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            storeId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        orderId: string;
        senderId: string;
        text: string;
    })[]>;
    addOrderMessage(orderId: string, senderId: string, text: string): Promise<{
        sender: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            storeId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        orderId: string;
        senderId: string;
        text: string;
    }>;
}
