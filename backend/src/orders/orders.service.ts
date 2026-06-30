import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { OrderStatus } from '@prisma/client';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);  
  const dLon = (lon2 - lon1) * (Math.PI / 180); 
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService
  ) {}

  async createOrder(
    storeId: string, 
    customerId: string, 
    items: { productId: string, quantity: number }[],
    delivery?: { address: string, lat: number, lng: number },
    requireOtp?: boolean
  ) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    if (delivery && store.latitude && store.longitude) {
      const distance = getDistanceFromLatLonInKm(store.latitude, store.longitude, delivery.lat, delivery.lng);
      if (distance > store.operatingRadiusKm) {
        throw new BadRequestException(`Delivery address is ${distance.toFixed(1)}km away. This store only delivers within ${store.operatingRadiusKm}km.`);
      }
    }

    // 1. Validate items and stock
    let totalAmount = 0;
    const validatedItems: {productId: string, quantity: number, priceAtOrder: number}[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const avail = await this.inventoryService.getAvailableStock(storeId, item.productId);
      if (avail.available < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      
      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtOrder: product.sellingPrice,
      });

      totalAmount += (product.sellingPrice * item.quantity);
    }

    return this.prisma.$transaction(async (tx) => {
      // 2. Create Order
      const order = await tx.order.create({
        data: {
          storeId,
          customerId,
          status: OrderStatus.PAYMENT_PENDING,
          totalAmount,
          deliveryAddress: delivery?.address,
          deliveryLat: delivery?.lat,
          deliveryLng: delivery?.lng,
          requireOtp: requireOtp || false,
          items: {
            create: validatedItems,
          },
        },
      });

      // 3. Reserve Stock
      for (const item of validatedItems) {
        await tx.inventory.updateMany({
          where: { storeId, productId: item.productId },
          data: {
            reservedQty: { increment: item.quantity }
          }
        });
        
        // Log movement
        const inv = await tx.inventory.findFirst({ where: { storeId, productId: item.productId }});
        if (inv) {
          await tx.stockMovement.create({
            data: {
              storeId,
              productId: item.productId,
              inventoryId: inv.id,
              type: 'ONLINE_ORDER_RESERVED',
              quantityChange: -item.quantity, // visually negative for available stock
              sourceType: 'ORDER',
              sourceId: order.id,
            }
          });
        }
      }

      return order;
    });
  }

  async payOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.PAYMENT_PENDING) {
      throw new BadRequestException('Order not found or not pending payment');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
    });
  }

  async pickOrder(orderId: string, staffId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order || (order.status !== OrderStatus.PAID && order.status !== OrderStatus.PICKING)) {
        throw new BadRequestException('Order cannot be picked');
      }

      // 1. Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.READY_FOR_PICKUP, staffId },
      });

      // 2. Un-reserve and deduct permanent stock
      for (const item of order.items) {
        await tx.inventory.updateMany({
          where: { storeId: order.storeId, productId: item.productId },
          data: {
            reservedQty: { decrement: item.quantity },
            onHandQty: { decrement: item.quantity }
          }
        });
        
        const inv = await tx.inventory.findFirst({ where: { storeId: order.storeId, productId: item.productId }});
        if (inv) {
          await tx.stockMovement.create({
            data: {
              storeId: order.storeId,
              productId: item.productId,
              inventoryId: inv.id,
              type: 'ONLINE_ORDER_PICKED',
              quantityChange: -item.quantity, // this represents actual permanent deduction
              sourceType: 'ORDER',
              sourceId: order.id,
              staffId,
            }
          });
        }
      }

      return updatedOrder;
    });
  }

  async getStoreOrders(storeId: string) {
    return this.prisma.order.findMany({
      where: { storeId },
      include: {
        customer: true,
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } }
      }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async startDelivery(orderId: string, staffId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.READY_FOR_PICKUP) {
      throw new BadRequestException('Order cannot be delivered yet');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.OUT_FOR_DELIVERY, staffId },
    });
  }

  async completeOrder(orderId: string, staffId: string, otp?: string) {
    const order = await this.prisma.order.findUnique({ 
      where: { id: orderId },
      include: { customer: true }
    });

    if (!order || order.status !== OrderStatus.OUT_FOR_DELIVERY) {
      throw new BadRequestException('Order cannot be completed yet');
    }

    if (order.requireOtp) {
      if (!otp) throw new BadRequestException('OTP required for this delivery');
      const phone = order.customer.phone;
      if (!phone || phone.length < 4) {
        // Fallback if user phone is somehow invalid
        throw new BadRequestException('Customer phone invalid for OTP');
      }
      const expectedOtp = phone.slice(-4);
      if (otp !== expectedOtp) {
        throw new BadRequestException('Invalid OTP');
      }
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.DELIVERED },
    });
  }

  async getOrderMessages(orderId: string) {
    return this.prisma.orderMessage.findMany({
      where: { orderId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addOrderMessage(orderId: string, senderId: string, text: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.orderMessage.create({
      data: {
        orderId,
        senderId,
        text
      },
      include: { sender: true }
    });
  }
}
