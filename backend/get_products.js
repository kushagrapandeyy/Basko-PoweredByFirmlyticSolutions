const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});
async function run() {
  const products = await prisma.product.findMany();
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}
run();
