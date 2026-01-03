import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHomeData() {
    // Get active home sections
    const sections = await this.prisma.homeSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Get banners
    const banners = await this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Get categories
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 12,
    });

    // Get deal items
    const deals = await this.prisma.item.findMany({
      where: {
        isActive: true,
        isAvailable: true,
        discountPrice: { not: null },
      },
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { discountPercent: 'desc' },
      take: 10,
    });

    // Get popular items (based on tags)
    const popular = await this.prisma.item.findMany({
      where: {
        isActive: true,
        isAvailable: true,
        tags: {
          array_contains: ['POPULAR'],
        },
      },
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      take: 10,
    });

    // Get shops
    const shops = await this.prisma.shop.findMany({
      where: { isActive: true, isOpen: true },
      take: 8,
    });

    return {
      sections,
      banners,
      categories,
      deals,
      popular,
      shops,
    };
  }
}
