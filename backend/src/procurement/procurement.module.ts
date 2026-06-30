import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order/purchase-order.service';
import { PurchaseOrderController } from './purchase-order/purchase-order.controller';
import { GrnService } from './grn/grn.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, GrnService, PrismaService],
  exports: [PurchaseOrderService, GrnService]
})
export class ProcurementModule {}
