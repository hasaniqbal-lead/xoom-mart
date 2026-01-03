import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: {
    customerPhone: string;
    customerName?: string;
    deliveryAddress: string;
    shopId?: string;
    items: Array<{ itemId: string; quantity: number }>;
    notes?: string;
  }) {
    // Get platform config
    const deliveryFeeConfig = await this.prisma.platformConfig.findUnique({
      where: { key: 'delivery_fee' },
    });
    const platformFeeConfig = await this.prisma.platformConfig.findUnique({
      where: { key: 'platform_fee' },
    });
    const taxConfig = await this.prisma.platformConfig.findUnique({
      where: { key: 'tax' },
    });

    // Calculate order totals
    let subtotal = new Prisma.Decimal(0);
    const orderItems: any[] = [];

    for (const item of data.items) {
      const product = await this.prisma.item.findUnique({
        where: { id: item.itemId },
      });

      if (!product) {
        throw new NotFoundException(`Item ${item.itemId} not found`);
      }

      const price = product.discountPrice || product.price;
      const total = new Prisma.Decimal(price.toString()).mul(item.quantity);
      subtotal = subtotal.add(total);

      orderItems.push({
        itemId: item.itemId,
        itemName: product.name,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: total,
      });
    }

    // Calculate fees
    const deliveryFee =
      subtotal.gte((deliveryFeeConfig?.value as any)?.freeAbove || 500)
        ? new Prisma.Decimal(0)
        : new Prisma.Decimal((deliveryFeeConfig?.value as any)?.default || 50);

    const platformFee = subtotal
      .mul((platformFeeConfig?.value as any)?.percentage || 0)
      .div(100);

    const tax = subtotal.mul((taxConfig?.value as any)?.percentage || 0).div(100);

    const total = subtotal.add(deliveryFee).add(platformFee).add(tax);

    // Generate order number
    const orderNumber = `XM${Date.now()}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerPhone: data.customerPhone,
        customerName: data.customerName,
        deliveryAddress: data.deliveryAddress,
        shopId: data.shopId,
        subtotal,
        deliveryFee,
        platformFee,
        tax,
        total,
        codAmount: total,
        notes: data.notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async trackOrder(phone: string, orderNumber: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        customerPhone: phone,
        orderNumber: orderNumber,
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        rider: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async submitFeedback(orderId: string, rating: number, comment?: string) {
    return this.prisma.feedback.create({
      data: {
        orderId,
        rating,
        comment,
      },
    });
  }

  // Admin methods
  async getAllOrders(filters?: any) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.customerPhone) {
      where.customerPhone = { contains: filters.customerPhone };
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            item: true,
          },
        },
        shop: true,
        rider: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        shop: true,
        rider: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        feedbacks: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, status: string) {
    const updateData: any = { status };

    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        rider: true,
      },
    });
  }

  async assignRider(orderId: string, riderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        riderId,
        status: 'ASSIGNED',
      },
      include: {
        rider: true,
      },
    });
  }

  async getOrderStats() {
    const total = await this.prisma.order.count();
    const placed = await this.prisma.order.count({ where: { status: 'PLACED' } });
    const assigned = await this.prisma.order.count({ where: { status: 'ASSIGNED' } });
    const delivered = await this.prisma.order.count({ where: { status: 'DELIVERED' } });

    const revenue = await this.prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    });

    return {
      total,
      placed,
      assigned,
      delivered,
      revenue: revenue._sum.total || 0,
    };
  }

  // Rider methods
  async getRiderOrders(riderId: string) {
    return this.prisma.order.findMany({
      where: {
        riderId,
        status: { not: 'DELIVERED' },
      },
      include: {
        items: {
          include: {
            item: true,
          },
        },
        shop: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatusByRider(orderId: string, riderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.riderId !== riderId) {
      throw new NotFoundException('Order not found or not assigned to you');
    }

    const updateData: any = { status };
    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });
  }

  async collectCOD(orderId: string, riderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.riderId !== riderId) {
      throw new NotFoundException('Order not found or not assigned to you');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { codCollected: true },
    });
  }
}
