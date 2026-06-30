import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  @OnEvent('purchase_order.created')
  handlePurchaseOrderCreated(po: any) {
    this.logger.log(`New Purchase Order created: ${po.id}`);
    
    // In a real system, this would send an SMS/Email to the supplier.
    // For MVP, we simulate generating a magic link.
    const magicLink = `https://supplier.basko.com/po/${po.id}?token=mock_token_123`;
    this.logger.log(`Mock Magic Link for Supplier ${po.supplierId}: ${magicLink}`);
    
    // You could also emit another event here like 'notification.sent'
  }

  @OnEvent('inventory.low_stock')
  handleLowStock(event: { storeId: string; productId: string; onHandQty: number }) {
    this.logger.warn(`Low Stock Alert for Store ${event.storeId}! Product ${event.productId} is down to ${event.onHandQty} units.`);
    
    // In a real system, this could trigger a push notification to the Store Manager
    // or automatically generate a draft Purchase Order via the Procurement Service.
  }
}
