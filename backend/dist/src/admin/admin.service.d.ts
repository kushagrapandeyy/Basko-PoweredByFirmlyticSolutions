import { PrismaService } from '../prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    logAudit(action: string, entityType: string, entityId?: string, userId?: string, details?: string): Promise<{
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        details: string | null;
        createdAt: Date;
        userId: string | null;
    }>;
    getStores(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        operatingRadiusKm: number;
        gstin: string | null;
        isActive: boolean;
        updatedAt: Date;
        bankAccountNumber: string | null;
        bankRoutingNumber: string | null;
        taxId: string | null;
    }[]>;
    createStore(data: any, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        operatingRadiusKm: number;
        gstin: string | null;
        isActive: boolean;
        updatedAt: Date;
        bankAccountNumber: string | null;
        bankRoutingNumber: string | null;
        taxId: string | null;
    }>;
    getVendors(): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        storeId: string | null;
    }[]>;
    createVendor(data: any, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        storeId: string | null;
    }>;
    getAudits(): Promise<({
        user: {
            id: string;
            createdAt: Date;
            name: string | null;
            updatedAt: Date;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            storeId: string | null;
        } | null;
    } & {
        id: string;
        action: string;
        entityType: string;
        entityId: string | null;
        details: string | null;
        createdAt: Date;
        userId: string | null;
    })[]>;
}
