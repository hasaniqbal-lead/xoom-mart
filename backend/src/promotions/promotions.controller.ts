import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Promotions')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  // Promotions
  @Get('promotions')
  @ApiOperation({ summary: 'Admin: Get all promotions' })
  getAllPromotions() {
    return this.promotionsService.getAllPromotions();
  }

  @Post('promotions')
  @ApiOperation({ summary: 'Admin: Create promotion' })
  createPromotion(@Body() data: any) {
    return this.promotionsService.createPromotion(data);
  }

  @Put('promotions/:id')
  @ApiOperation({ summary: 'Admin: Update promotion' })
  updatePromotion(@Param('id') id: string, @Body() data: any) {
    return this.promotionsService.updatePromotion(id, data);
  }

  @Delete('promotions/:id')
  @ApiOperation({ summary: 'Admin: Delete promotion' })
  deletePromotion(@Param('id') id: string) {
    return this.promotionsService.deletePromotion(id);
  }

  // Banners
  @Get('banners')
  @ApiOperation({ summary: 'Admin: Get all banners' })
  getAllBanners() {
    return this.promotionsService.getAllBanners();
  }

  @Post('banners')
  @ApiOperation({ summary: 'Admin: Create banner' })
  createBanner(@Body() data: any) {
    return this.promotionsService.createBanner(data);
  }

  @Put('banners/:id')
  @ApiOperation({ summary: 'Admin: Update banner' })
  updateBanner(@Param('id') id: string, @Body() data: any) {
    return this.promotionsService.updateBanner(id, data);
  }

  @Delete('banners/:id')
  @ApiOperation({ summary: 'Admin: Delete banner' })
  deleteBanner(@Param('id') id: string) {
    return this.promotionsService.deleteBanner(id);
  }

  // Home Sections
  @Get('home-sections')
  @ApiOperation({ summary: 'Admin: Get all home sections' })
  getAllHomeSections() {
    return this.promotionsService.getAllHomeSections();
  }

  @Put('home-sections/:id')
  @ApiOperation({ summary: 'Admin: Update home section' })
  updateHomeSection(@Param('id') id: string, @Body() data: any) {
    return this.promotionsService.updateHomeSection(id, data);
  }
}
