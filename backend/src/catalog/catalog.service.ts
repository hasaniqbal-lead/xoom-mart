import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  // Categories
  async getCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(data: any) {
    return this.prisma.category.create({ data });
  }

  async updateCategory(id: string, data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  // Subcategories
  async getSubcategoryBySlug(slug: string) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { slug },
      include: {
        category: true,
        items: {
          where: { isActive: true, isAvailable: true },
        },
      },
    });
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategory;
  }

  async createSubcategory(data: any) {
    return this.prisma.subcategory.create({ data });
  }

  async updateSubcategory(id: string, data: any) {
    return this.prisma.subcategory.update({
      where: { id },
      data,
    });
  }

  async deleteSubcategory(id: string) {
    return this.prisma.subcategory.delete({ where: { id } });
  }

  // Items
  async getItems(filters?: any) {
    const where: any = { isActive: true };

    if (filters?.subcategoryId) {
      where.subcategoryId = filters.subcategoryId;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    return this.prisma.item.findMany({
      where,
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getItemBySlug(slug: string) {
    const item = await this.prisma.item.findUnique({
      where: { slug },
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async searchItems(query: string) {
    return this.prisma.item.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      take: 20,
    });
  }

  async getDealItems() {
    return this.prisma.item.findMany({
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
      take: 20,
    });
  }

  async createItem(data: any) {
    return this.prisma.item.create({
      data,
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async updateItem(id: string, data: any) {
    return this.prisma.item.update({
      where: { id },
      data,
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async deleteItem(id: string) {
    return this.prisma.item.delete({ where: { id } });
  }

  // Admin - Get all (including inactive)
  async getAllCategoriesAdmin() {
    return this.prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        subcategories: true,
      },
    });
  }

  async getAllItemsAdmin(filters?: any) {
    const where: any = {};
    if (filters?.subcategoryId) {
      where.subcategoryId = filters.subcategoryId;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.item.findMany({
      where,
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
