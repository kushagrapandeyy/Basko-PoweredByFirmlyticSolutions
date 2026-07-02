import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma.service';

interface ExpoPushMessage {
  to: string;
  sound: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  constructor(private prisma: PrismaService) {}

  // ─── Core Push Sender ────────────────────────────────────────────────────

  async sendPush(userId: string, title: string, body: string, data?: Record<string, any>) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true, name: true },
    });

    if (!user?.pushToken) {
      this.logger.debug(`No push token for user ${userId}`);
      return;
    }

    const message: ExpoPushMessage = {
      to: user.pushToken,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    };

    try {
      const res = await fetch(this.EXPO_PUSH_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Accept-encoding': 'gzip, deflate', 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      const json = await res.json() as any;
      if (json?.data?.status === 'error') {
        this.logger.error(`Push failed for ${userId}: ${json.data.message}`);
      } else {
        this.logger.log(`Push sent to ${userId}: "${title}"`);
      }
    } catch (err: any) {
      this.logger.error(`Push delivery error: ${err.message}`);
    }
  }

  async broadcastToStore(storeId: string, title: string, body: string, data?: Record<string, any>) {
    const staff = await this.prisma.user.findMany({
      where: { storeId, pushToken: { not: null } },
      select: { id: true },
    });
    await Promise.all(staff.map((s) => this.sendPush(s.id, title, body, data)));
  }

  // ─── Event Listeners ─────────────────────────────────────────────────────

  @OnEvent('purchase_order.created')
  async handlePurchaseOrderCreated(po: any) {
    this.logger.log(`PO created: ${po.id} for supplier ${po.supplierId}`);
    // Notify store owner/manager
    await this.broadcastToStore(
      po.storeId,
      '📦 Purchase Order Created',
      `PO sent to supplier. Total: ₹${po.totalAmount}`,
      { type: 'purchase_order', poId: po.id },
    );
  }

  @OnEvent('inventory.low_stock')
  async handleLowStock(event: { storeId: string; productId: string; onHandQty: number }) {
    this.logger.warn(`Low stock: product ${event.productId} in store ${event.storeId} → ${event.onHandQty} units`);

    const product = await this.prisma.product.findUnique({
      where: { id: event.productId },
      select: { name: true },
    });

    await this.broadcastToStore(
      event.storeId,
      '⚠️ Low Stock Alert',
      `${product?.name ?? 'A product'} is running low (${event.onHandQty} left). Consider reordering.`,
      { type: 'low_stock', productId: event.productId, onHandQty: event.onHandQty },
    );
  }

  @OnEvent('subscription.order_created')
  async handleSubscriptionOrderCreated(event: { customerId: string; orderId: string; productCount: number }) {
    await this.sendPush(
      event.customerId,
      '🛒 Subscription Order Placed',
      `Your recurring order (${event.productCount} items) is confirmed and being prepared.`,
      { type: 'subscription_order', orderId: event.orderId },
    );
  }

  @OnEvent('order.out_for_delivery')
  async handleOrderOutForDelivery(event: { customerId: string; orderId: string }) {
    await this.sendPush(
      event.customerId,
      '🚴 Your Order is on the Way!',
      'Track your delivery in real-time in the app.',
      { type: 'order_tracking', orderId: event.orderId },
    );
  }

  @OnEvent('order.delivered')
  async handleOrderDelivered(event: { customerId: string; orderId: string }) {
    await this.sendPush(
      event.customerId,
      '✅ Order Delivered!',
      'Your order has been delivered. Tap to rate your experience.',
      { type: 'order_delivered', orderId: event.orderId },
    );
  }
}
