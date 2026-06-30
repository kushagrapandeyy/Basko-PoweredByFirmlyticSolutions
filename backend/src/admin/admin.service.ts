import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async logAudit(action: string, entityType: string, entityId?: string, userId?: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        details,
      }
    });
  }

  async getStores() {
    return this.prisma.store.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createStore(data: any, adminId: string) {
    if (!data.name || !data.address) {
      throw new BadRequestException('Store name and address are required');
    }

    const store = await this.prisma.store.create({
      data: {
        name: data.name,
        location: data.address || data.location,
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        operatingRadiusKm: parseFloat(data.operatingRadiusKm) || 5,
        bankAccountNumber: data.bankAccountNumber || null,
        bankRoutingNumber: data.bankRoutingNumber || null,
        taxId: data.taxId || null,
      }
    });

    await this.logAudit('STORE_CREATED', 'STORE', store.id, adminId, `Created store ${store.name}`);
    return store;
  }

  async getVendors() {
    return this.prisma.user.findMany({
      where: { role: 'STAFF' },
      include: { store: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createVendor(data: any, adminId: string) {
    if (!data.name || !data.email || !data.phone || !data.password || !data.storeId) {
      throw new BadRequestException('All vendor fields are required');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('User with email already exists');
    }

    const store = await this.prisma.store.findUnique({ where: { id: data.storeId } });
    if (!store) {
      throw new NotFoundException('Assigned store not found');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: 'STAFF',
        storeId: store.id
      }
    });

    await this.logAudit('VENDOR_CREATED', 'USER', user.id, adminId, `Created vendor ${user.name} for store ${store.name}`);
    return user;
  }

  async getAudits() {
    return this.prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
