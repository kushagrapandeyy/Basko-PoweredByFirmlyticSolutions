import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
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
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
    }>;
    createOrder(body: {
        storeId: string;
        customerId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
        delivery?: {
            address: string;
            lat: number;
            lng: number;
        };
        requireOtp?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
    }>;
    payOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
    }>;
    pickOrder(id: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
    }>;
    startDelivery(id: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
    }>;
    completeOrder(id: string, staffId: string, otp?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        staffId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        deliveryFee: number;
        deliveryAddress: string | null;
        deliveryLat: number | null;
        deliveryLng: number | null;
        requireOtp: boolean;
        customerId: string;
    }>;
    getOrderMessages(id: string): Promise<({
        sender: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
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
    addOrderMessage(id: string, senderId: string, text: string): Promise<{
        sender: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
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
