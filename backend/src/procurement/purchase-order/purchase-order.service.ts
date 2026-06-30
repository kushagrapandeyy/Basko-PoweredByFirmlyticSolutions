import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { POStatus } from '@prisma/client';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async createPO(storeId: string, supplierId: string, expectedDeliveryDate: Date, items: { productId: string, quantity: number, purchasePrice: number }[], notes?: string) {
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
        status: POStatus.CREATED,
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

  async getPOs(storeId: string) {
    return this.prisma.purchaseOrder.findMany({
      where: { storeId },
      include: { supplier: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPOById(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { product: true } } }
    });
    if (!po) throw new NotFoundException('PO not found');
    return po;
  }

  async acceptPO(id: string) {
    const po = await this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: POStatus.ACCEPTED },
      include: { items: true }
    });
    this.eventEmitter.emit('purchase_order.accepted', po);
    return po;
  }
}
