import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStores(): Promise<{
        id: string;
        name: string;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        operatingRadiusKm: number;
        gstin: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        bankAccountNumber: string | null;
        bankRoutingNumber: string | null;
        taxId: string | null;
    }[]>;
    createStore(body: any, req: any): Promise<{
        id: string;
        name: string;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        operatingRadiusKm: number;
        gstin: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        bankAccountNumber: string | null;
        bankRoutingNumber: string | null;
        taxId: string | null;
    }>;
    getVendors(): Promise<({
        store: {
            id: string;
            name: string;
            location: string | null;
            latitude: number | null;
            longitude: number | null;
            operatingRadiusKm: number;
            gstin: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            bankAccountNumber: string | null;
            bankRoutingNumber: string | null;
            taxId: string | null;
        } | null;
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        storeId: string | null;
    })[]>;
    createVendor(body: any, req: any): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        storeId: string | null;
    }>;
    getAudits(): Promise<({
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            storeId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
        details: string | null;
        userId: string | null;
    })[]>;
}
