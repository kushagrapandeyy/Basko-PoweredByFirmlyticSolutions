const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});
async function run() {
  await prisma.store.updateMany({
    data: {
      latitude: 12.9716, // Bangalore coordinates
      longitude: 77.5946,
      operatingRadiusKm: 3.0
    }
  });
  console.log('Store geospatial data updated');
  await prisma.$disconnect();
}
run();
