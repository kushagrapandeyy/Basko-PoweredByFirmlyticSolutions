import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stores')
  getStores() {
    return this.adminService.getStores();
  }

  @Post('stores')
  createStore(@Body() body: any, @Request() req: any) {
    return this.adminService.createStore(body, req.user.id);
  }

  @Get('vendors')
  getVendors() {
    return this.adminService.getVendors();
  }

  @Post('vendors')
  createVendor(@Body() body: any, @Request() req: any) {
    return this.adminService.createVendor(body, req.user.id);
  }

  @Get('audits')
  getAudits() {
    return this.adminService.getAudits();
  }
}
