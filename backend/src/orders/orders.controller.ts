import { Controller, Get, Post, Patch, Body, Query, Param, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getStoreOrders(@Query('storeId') storeId: string) {
    if (!storeId) throw new BadRequestException('storeId is required');
    return this.ordersService.getStoreOrders(storeId);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  createOrder(@Body() body: { 
    storeId: string; 
    customerId: string; 
    items: { productId: string, quantity: number }[];
    delivery?: { address: string, lat: number, lng: number };
    requireOtp?: boolean;
  }) {
    if (!body.storeId || !body.customerId || !body.items || body.items.length === 0) {
      throw new BadRequestException('Invalid order payload');
    }
    return this.ordersService.createOrder(body.storeId, body.customerId, body.items, body.delivery, body.requireOtp);
  }

  @Post(':id/pay')
  payOrder(@Param('id') id: string) {
    return this.ordersService.payOrder(id);
  }

  @Patch(':id/pick')
  pickOrder(@Param('id') id: string, @Body('staffId') staffId: string) {
    if (!staffId) throw new BadRequestException('staffId required');
    return this.ordersService.pickOrder(id, staffId);
  }

  @Patch(':id/deliver')
  startDelivery(@Param('id') id: string, @Body('staffId') staffId: string) {
    if (!staffId) throw new BadRequestException('staffId required');
    return this.ordersService.startDelivery(id, staffId);
  }

  @Patch(':id/complete')
  completeOrder(
    @Param('id') id: string,
    @Body('staffId') staffId: string,
    @Body('otp') otp?: string
  ) {
    if (!staffId) throw new BadRequestException('staffId required');
    return this.ordersService.completeOrder(id, staffId, otp);
  }

  @Get(':id/messages')
  getOrderMessages(@Param('id') id: string) {
    return this.ordersService.getOrderMessages(id);
  }

  @Post(':id/messages')
  addOrderMessage(
    @Param('id') id: string,
    @Body('senderId') senderId: string,
    @Body('text') text: string
  ) {
    if (!senderId || !text) throw new BadRequestException('senderId and text required');
    return this.ordersService.addOrderMessage(id, senderId, text);
  }
}
