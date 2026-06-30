const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});
async function run() {
  const storeId = 'f15b0af3-3667-429a-ae2e-9f85d25e9c2f';
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    let inventory = await prisma.inventory.findFirst({
      where: { storeId, productId: product.id }
    });
    
    if (inventory) {
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: { onHandQty: 100 }
      });
    } else {
      await prisma.inventory.create({
        data: {
          storeId,
          productId: product.id,
          onHandQty: 100
        }
      });
    }
  }
  
  console.log('Seeded inventory');
  await prisma.$disconnect();
}
run();
