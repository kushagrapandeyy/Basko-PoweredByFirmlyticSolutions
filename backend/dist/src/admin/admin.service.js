"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logAudit(action, entityType, entityId, userId, details) {
        return this.prisma.auditLog.create({
            data: {
                action,
                entityType,
                entityId,
                userId,
                details,
            }
        });
    }
    async getStores() {
        return this.prisma.store.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async createStore(data, adminId) {
        if (!data.name || !data.address) {
            throw new common_1.BadRequestException('Store name and address are required');
        }
        const store = await this.prisma.store.create({
            data: {
                name: data.name,
                address: data.address,
                latitude: parseFloat(data.latitude) || 0,
                longitude: parseFloat(data.longitude) || 0,
                operatingRadiusKm: parseFloat(data.operatingRadiusKm) || 5,
                bankAccountNumber: data.bankAccountNumber || null,
                bankRoutingNumber: data.bankRoutingNumber || null,
                taxId: data.taxId || null,
            }
        });
        await this.logAudit('STORE_CREATED', 'STORE', store.id, adminId, `Created store ${store.name}`);
        return store;
    }
    async getVendors() {
        return this.prisma.user.findMany({
            where: { role: 'STAFF' },
            include: { vendor: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createVendor(data, adminId) {
        if (!data.name || !data.email || !data.phone || !data.password || !data.storeId) {
            throw new common_1.BadRequestException('All vendor fields are required');
        }
        const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('User with email already exists');
        }
        const store = await this.prisma.store.findUnique({ where: { id: data.storeId } });
        if (!store) {
            throw new common_1.NotFoundException('Assigned store not found');
        }
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                phone: data.phone,
                role: 'STAFF'
            }
        });
        await this.prisma.vendor.create({
            data: {
                userId: user.id,
                storeId: store.id
            }
        });
        await this.logAudit('VENDOR_CREATED', 'USER', user.id, adminId, `Created vendor ${user.name} for store ${store.name}`);
        return user;
    }
    async getAudits() {
        return this.prisma.auditLog.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map