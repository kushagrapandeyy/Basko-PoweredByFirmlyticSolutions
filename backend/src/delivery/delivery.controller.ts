import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  /**
   * GET /delivery/:orderId/location
   * Last known delivery agent location — used when consumer app cold-starts.
   */
  @Get(':orderId/location')
  getLastLocation(@Param('orderId') orderId: string) {
    return this.deliveryService.getLastLocation(orderId);
  }

  /**
   * POST /delivery/:orderId/location
   * REST fallback for location updates if WebSocket disconnects.
   * Body: { lat: number, lng: number, staffId: string }
   */
  @Post(':orderId/location')
  updateLocation(
    @Param('orderId') orderId: string,
    @Body() body: { lat: number; lng: number; staffId: string },
  ) {
    return this.deliveryService.updateLastLocation(orderId, body.lat, body.lng);
  }
}
