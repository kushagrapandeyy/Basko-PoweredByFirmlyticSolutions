import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stores')
  getStores() {
    return this.adminService.getStores();
  }

  @Post('stores')
  createStore(@Body() body: any, @Headers('x-admin-id') adminId: string = 'mock-admin') {
    return this.adminService.createStore(body, adminId);
  }

  @Get('vendors')
  getVendors() {
    return this.adminService.getVendors();
  }

  @Post('vendors')
  createVendor(@Body() body: any, @Headers('x-admin-id') adminId: string = 'mock-admin') {
    return this.adminService.createVendor(body, adminId);
  }

  @Get('audits')
  getAudits() {
    return this.adminService.getAudits();
  }
}
