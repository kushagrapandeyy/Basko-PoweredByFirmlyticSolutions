import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Note: will throw if DB is not connected, but we'll mock or wait for Supabase
    try {
      await this.$connect();
    } catch (e) {
      console.warn("Database connection skipped for now pending Supabase credentials.");
    }
  }
}
