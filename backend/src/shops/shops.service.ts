import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async getShops() {
    return this.prisma.shop.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShopBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { slug },
      include: {
        shopItems: {
          where: { isAvailable: true },
          include: {
            item: {
              include: {
                subcategory: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  // Admin methods
  async getAllShopsAdmin() {
    return this.prisma.shop.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        shopItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async createShop(data: any) {
    return this.prisma.shop.create({ data });
  }

  async updateShop(id: string, data: any) {
    return this.prisma.shop.update({
      where: { id },
      data,
    });
  }

  async deleteShop(id: string) {
    return this.prisma.shop.delete({ where: { id } });
  }

  async addItemToShop(shopId: string, itemId: string, shopPrice?: number) {
    return this.prisma.shopItem.create({
      data: {
        shopId,
        itemId,
        shopPrice,
      },
    });
  }

  async removeItemFromShop(shopId: string, itemId: string) {
    return this.prisma.shopItem.deleteMany({
      where: {
        shopId,
        itemId,
      },
    });
  }
}
