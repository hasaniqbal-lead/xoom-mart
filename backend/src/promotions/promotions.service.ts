import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  // Promotions
  async getAllPromotions() {
    return this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPromotion(data: any) {
    return this.prisma.promotion.create({ data });
  }

  async updatePromotion(id: string, data: any) {
    return this.prisma.promotion.update({
      where: { id },
      data,
    });
  }

  async deletePromotion(id: string) {
    return this.prisma.promotion.delete({ where: { id } });
  }

  // Banners
  async getAllBanners() {
    return this.prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getActiveBanners() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createBanner(data: any) {
    return this.prisma.banner.create({ data });
  }

  async updateBanner(id: string, data: any) {
    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async deleteBanner(id: string) {
    return this.prisma.banner.delete({ where: { id } });
  }

  // Home Sections
  async getAllHomeSections() {
    return this.prisma.homeSection.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateHomeSection(id: string, data: any) {
    return this.prisma.homeSection.update({
      where: { id },
      data,
    });
  }
}
