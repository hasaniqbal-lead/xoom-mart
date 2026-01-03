import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService, PrismaService],
})
export class HomeModule {}
