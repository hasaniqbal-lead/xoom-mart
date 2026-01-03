import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@xoommart.com' },
    update: {},
    create: {
      email: 'admin@xoommart.com',
      phone: '+923001234567',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create rider user
  const riderPasswordHash = await bcrypt.hash('Rider@123', 10);
  const rider = await prisma.user.upsert({
    where: { phone: '+923009876543' },
    update: {},
    create: {
      phone: '+923009876543',
      name: 'Test Rider',
      role: 'RIDER',
      passwordHash: riderPasswordHash,
      isActive: true,
    },
  });
  console.log('✅ Created rider user:', rider.name);

  // Create platform config
  await prisma.platformConfig.upsert({
    where: { key: 'delivery_fee' },
    update: {},
    create: {
      key: 'delivery_fee',
      value: { default: 50, freeAbove: 500 },
      description: 'Default delivery fee and free delivery threshold',
    },
  });

  await prisma.platformConfig.upsert({
    where: { key: 'platform_fee' },
    update: {},
    create: {
      key: 'platform_fee',
      value: { percentage: 5 },
      description: 'Platform fee percentage',
    },
  });

  await prisma.platformConfig.upsert({
    where: { key: 'tax' },
    update: {},
    create: {
      key: 'tax',
      value: { percentage: 0 },
      description: 'Tax percentage',
    },
  });

  await prisma.platformConfig.upsert({
    where: { key: 'min_order_value' },
    update: {},
    create: {
      key: 'min_order_value',
      value: { amount: 200 },
      description: 'Minimum order value',
    },
  });
  console.log('✅ Created platform config');

  // Create categories
  const grocery = await prisma.category.upsert({
    where: { slug: 'grocery' },
    update: {},
    create: {
      name: 'Grocery',
      slug: 'grocery',
      displayOrder: 1,
      isActive: true,
    },
  });

  const snacks = await prisma.category.upsert({
    where: { slug: 'snacks' },
    update: {},
    create: {
      name: 'Snacks',
      slug: 'snacks',
      displayOrder: 2,
      isActive: true,
    },
  });

  const beverages = await prisma.category.upsert({
    where: { slug: 'beverages' },
    update: {},
    create: {
      name: 'Beverages',
      slug: 'beverages',
      displayOrder: 3,
      isActive: true,
    },
  });
  console.log('✅ Created categories');

  // Create subcategories
  const vegetables = await prisma.subcategory.upsert({
    where: { slug: 'vegetables' },
    update: {},
    create: {
      name: 'Vegetables',
      slug: 'vegetables',
      categoryId: grocery.id,
      displayOrder: 1,
      isActive: true,
    },
  });

  const fruits = await prisma.subcategory.upsert({
    where: { slug: 'fruits' },
    update: {},
    create: {
      name: 'Fruits',
      slug: 'fruits',
      categoryId: grocery.id,
      displayOrder: 2,
      isActive: true,
    },
  });

  const chips = await prisma.subcategory.upsert({
    where: { slug: 'chips' },
    update: {},
    create: {
      name: 'Chips',
      slug: 'chips',
      categoryId: snacks.id,
      displayOrder: 1,
      isActive: true,
    },
  });

  const softDrinks = await prisma.subcategory.upsert({
    where: { slug: 'soft-drinks' },
    update: {},
    create: {
      name: 'Soft Drinks',
      slug: 'soft-drinks',
      categoryId: beverages.id,
      displayOrder: 1,
      isActive: true,
    },
  });
  console.log('✅ Created subcategories');

  // Create sample items
  await prisma.item.upsert({
    where: { slug: 'tomatoes-1kg' },
    update: {},
    create: {
      name: 'Tomatoes (1kg)',
      slug: 'tomatoes-1kg',
      description: 'Fresh red tomatoes',
      subcategoryId: vegetables.id,
      price: 120,
      images: ['https://via.placeholder.com/400x400?text=Tomatoes'],
      isAvailable: true,
      stockQuantity: 100,
      tags: ['FRESH', 'POPULAR'],
      isActive: true,
    },
  });

  await prisma.item.upsert({
    where: { slug: 'bananas-1dozen' },
    update: {},
    create: {
      name: 'Bananas (1 Dozen)',
      slug: 'bananas-1dozen',
      description: 'Fresh yellow bananas',
      subcategoryId: fruits.id,
      price: 150,
      discountPrice: 130,
      discountPercent: 13,
      images: ['https://via.placeholder.com/400x400?text=Bananas'],
      isAvailable: true,
      stockQuantity: 80,
      tags: ['SALE', 'POPULAR'],
      isActive: true,
    },
  });

  await prisma.item.upsert({
    where: { slug: 'lays-chips' },
    update: {},
    create: {
      name: "Lay's Chips",
      slug: 'lays-chips',
      description: 'Crispy potato chips',
      subcategoryId: chips.id,
      price: 80,
      images: ['https://via.placeholder.com/400x400?text=Chips'],
      isAvailable: true,
      stockQuantity: 200,
      tags: ['NEW'],
      isActive: true,
    },
  });

  await prisma.item.upsert({
    where: { slug: 'coca-cola-1l' },
    update: {},
    create: {
      name: 'Coca Cola (1L)',
      slug: 'coca-cola-1l',
      description: 'Refreshing cola drink',
      subcategoryId: softDrinks.id,
      price: 120,
      images: ['https://via.placeholder.com/400x400?text=Cola'],
      isAvailable: true,
      stockQuantity: 150,
      isActive: true,
    },
  });
  console.log('✅ Created sample items');

  // Create home sections
  await prisma.homeSection.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      sectionType: 'HERO',
      title: 'Hero Banners',
      displayOrder: 1,
      isActive: true,
      config: {},
    },
  });

  await prisma.homeSection.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      sectionType: 'CATEGORIES',
      title: 'Shop by Category',
      displayOrder: 2,
      isActive: true,
      config: {},
    },
  });

  await prisma.homeSection.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      sectionType: 'DEALS',
      title: 'Deals & Offers',
      displayOrder: 3,
      isActive: true,
      config: {},
    },
  });

  await prisma.homeSection.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      sectionType: 'POPULAR',
      title: 'Popular Items',
      displayOrder: 4,
      isActive: true,
      config: {},
    },
  });
  console.log('✅ Created home sections');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
