const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});
async function run() {
  await prisma.user.update({
    where: { id: 'de283b71-1972-47b7-996f-6633d0f7b7f5' },
    data: { phone: '9876543210' }
  });
  console.log('Phone updated to 9876543210 (OTP: 3210)');
  await prisma.$disconnect();
}
run();
