import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getStoreOrders(storeId: string): Promise<({
        items: ({
            product: {
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
            storeId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
            storeId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
    payOrder(id: string): Promise<{
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
    pickOrder(id: string, staffId: string): Promise<{
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
    startDelivery(id: string, staffId: string): Promise<{
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
    completeOrder(id: string, staffId: string, otp?: string): Promise<{
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
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
    getOrderMessages(id: string): Promise<({
        sender: {
            id: string;
            storeId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
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
            storeId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        orderId: string;
        senderId: string;
        text: string;
    }>;
}
