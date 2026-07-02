import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Persist the last known GPS position of the delivery agent.
   * Used as REST fallback when consumer app re-opens (cold-start).
   */
  async updateLastLocation(orderId: string, lat: number, lng: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    // We reuse deliveryLat/deliveryLng to track the staff's CURRENT location
    // In production you'd add staffLat/staffLng fields to the schema
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        // Temporarily store staff location in these nullable fields
        // until a dedicated StaffLocation model is added
        deliveryLat: lat,
        deliveryLng: lng,
      },
    });
  }

  /**
   * GET /delivery/:orderId/location
   * Returns last known delivery agent location (for app cold-start after re-open).
   */
  async getLastLocation(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        deliveryLat: true,
        deliveryLng: true,
        deliveryAddress: true,
        staffId: true,
        staff: { select: { name: true, phone: true, avatarUrl: true } },
      },
    });

    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    return {
      orderId: order.id,
      status: order.status,
      staffLat: order.deliveryLat,
      staffLng: order.deliveryLng,
      deliveryAddress: order.deliveryAddress,
      staff: order.staff,
    };
  }
}
