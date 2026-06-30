import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
export declare class AppController {
    private readonly appService;
    private prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    getStore(id: string): Promise<{
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
    } | null>;
}
