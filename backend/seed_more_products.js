const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});
async function run() {
  const storeId = 'f15b0af3-3667-429a-ae2e-9f85d25e9c2f';
  await prisma.product.createMany({
    data: [
      {
        storeId,
        barcode: '8901234567891',
        internalSku: 'SKU-002',
        name: 'Britannia Whole Wheat Bread',
        category: 'Bakery',
        mrp: 45,
        sellingPrice: 45,
        imageUrl: 'https://via.placeholder.com/300/fef3c7/b45309?text=Bread'
      },
      {
        storeId,
        barcode: '8901234567892',
        internalSku: 'SKU-003',
        name: 'Tata Salt 1kg',
        category: 'Snacks',
        mrp: 28,
        sellingPrice: 28,
        imageUrl: 'https://via.placeholder.com/300/f3f4f6/374151?text=Salt'
      },
      {
        storeId,
        barcode: '8901234567893',
        internalSku: 'SKU-004',
        name: 'Surf Excel Matic 1kg',
        category: 'Cleaning',
        mrp: 215,
        sellingPrice: 215,
        imageUrl: 'https://via.placeholder.com/300/e0e7ff/4338ca?text=Detergent'
      }
    ]
  });
  console.log('seeded more products');
  await prisma.$disconnect();
}
run();
