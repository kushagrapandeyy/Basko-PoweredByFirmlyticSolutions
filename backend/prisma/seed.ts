import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an Owner (Admin to log into the web app)
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'admin@basko.com' },
    update: { password: hashedAdminPassword, role: 'OWNER' },
    create: {
      email: 'admin@basko.com',
      password: hashedAdminPassword,
      name: 'System Admin',
      role: 'OWNER',
    },
  });
  console.log(`Created admin user: ${owner.email} with password: admin123`);

  console.log('Database is completely fresh. Ready for you to onboard your first store via Web Admin!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
