"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const store = await prisma.store.create({
        data: {
            name: 'FreshMart Society Store',
            location: 'Tower B, Ground Floor',
            gstin: '29GGGGG1314R9Z6',
        },
    });
    console.log(`Created store: ${store.name}`);
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
    console.log(`Created admin user: ${owner.email}`);
    console.log(`Created user: ${owner.email}`);
    const products = [
        {
            storeId: store.id,
            internalSku: 'SKU-001',
            name: 'Amul Taaza Milk 1L',
            barcode: '8901234567890',
            category: 'Dairy',
            mrp: 68,
            sellingPrice: 68,
            purchaseCost: 55,
        },
        {
            storeId: store.id,
            internalSku: 'SKU-002',
            name: 'Britannia Whole Wheat Bread',
            barcode: '8901234567891',
            category: 'Bread & Eggs',
            mrp: 45,
            sellingPrice: 45,
            purchaseCost: 35,
        },
        {
            storeId: store.id,
            internalSku: 'SKU-003',
            name: 'Tata Salt 1kg',
            barcode: '8901234567892',
            category: 'Staples',
            mrp: 28,
            sellingPrice: 28,
            purchaseCost: 22,
        },
    ];
    for (const p of products) {
        await prisma.product.create({ data: p });
    }
    console.log('Created initial product master.');
    console.log('Seeding complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map