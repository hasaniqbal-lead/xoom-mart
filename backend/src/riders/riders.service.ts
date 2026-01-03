import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RidersService {
  constructor(private prisma: PrismaService) {}

  async getAllRiders() {
    return this.prisma.user.findMany({
      where: { role: 'RIDER' },
      select: {
        id: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRider(data: { name: string; phone: string; password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        passwordHash,
        role: 'RIDER',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        isActive: true,
      },
    });
  }

  async updateRider(id: string, data: any) {
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        phone: true,
        isActive: true,
      },
    });
  }

  async toggleRider(id: string) {
    const rider = await this.prisma.user.findUnique({ where: { id } });
    return this.prisma.user.update({
      where: { id },
      data: { isActive: !rider.isActive },
      select: {
        id: true,
        name: true,
        phone: true,
        isActive: true,
      },
    });
  }
}
