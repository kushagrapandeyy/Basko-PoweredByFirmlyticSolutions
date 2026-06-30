import { PrismaService } from '../prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    logAudit(action: string, entityType: string, entityId?: string, userId?: string, details?: string): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string | null;
        details: string | null;
        userId: string | null;
    }>;
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
    createStore(data: any, adminId: string): Promise<{
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
    createVendor(data: any, adminId: string): Promise<{
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
