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
exports.PurchaseOrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const client_1 = require("@prisma/client");
let PurchaseOrderService = class PurchaseOrderService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async createPO(storeId, supplierId, expectedDeliveryDate, items, notes) {
        let totalAmount = 0;
        for (const item of items) {
            totalAmount += (item.quantity * item.purchasePrice);
        }
        const po = await this.prisma.purchaseOrder.create({
            data: {
                storeId,
                supplierId,
                expectedDeliveryDate,
                totalAmount,
                notes,
                status: client_1.POStatus.CREATED,
                items: {
                    create: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        purchasePrice: i.purchasePrice,
                    }))
                }
            },
            include: { items: true }
        });
        this.eventEmitter.emit('purchase_order.created', po);
        return po;
    }
    async getPOs(storeId) {
        return this.prisma.purchaseOrder.findMany({
            where: { storeId },
            include: { supplier: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPOById(id) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { supplier: true, items: { include: { product: true } } }
        });
        if (!po)
            throw new common_1.NotFoundException('PO not found');
        return po;
    }
    async acceptPO(id) {
        const po = await this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: client_1.POStatus.ACCEPTED },
            include: { items: true }
        });
        this.eventEmitter.emit('purchase_order.accepted', po);
        return po;
    }
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], PurchaseOrderService);
//# sourceMappingURL=purchase-order.service.js.map