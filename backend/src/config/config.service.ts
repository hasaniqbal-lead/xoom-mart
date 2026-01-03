import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async getPublicConfig() {
    const configs = await this.prisma.platformConfig.findMany({
      where: {
        key: {
          in: ['delivery_fee', 'min_order_value'],
        },
      },
    });

    const result: any = {};
    configs.forEach((config) => {
      result[config.key] = config.value;
    });

    return result;
  }

  async getAllConfig() {
    return this.prisma.platformConfig.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async getConfigByKey(key: string) {
    return this.prisma.platformConfig.findUnique({
      where: { key },
    });
  }

  async updateConfig(key: string, value: any, description?: string) {
    return this.prisma.platformConfig.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }
}
