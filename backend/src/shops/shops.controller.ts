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
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Shops')
@Controller()
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  // Public endpoints
  @Get('shops')
  @ApiOperation({ summary: 'Get all shops' })
  getShops() {
    return this.shopsService.getShops();
  }

  @Get('shops/:slug')
  @ApiOperation({ summary: 'Get shop by slug' })
  getShopBySlug(@Param('slug') slug: string) {
    return this.shopsService.getShopBySlug(slug);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/shops')
  @ApiOperation({ summary: 'Admin: Get all shops' })
  getAllShopsAdmin() {
    return this.shopsService.getAllShopsAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/shops')
  @ApiOperation({ summary: 'Admin: Create shop' })
  createShop(@Body() data: any) {
    return this.shopsService.createShop(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/shops/:id')
  @ApiOperation({ summary: 'Admin: Update shop' })
  updateShop(@Param('id') id: string, @Body() data: any) {
    return this.shopsService.updateShop(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/shops/:id')
  @ApiOperation({ summary: 'Admin: Delete shop' })
  deleteShop(@Param('id') id: string) {
    return this.shopsService.deleteShop(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/shops/:id/items')
  @ApiOperation({ summary: 'Admin: Add item to shop' })
  addItemToShop(
    @Param('id') shopId: string,
    @Body() data: { itemId: string; shopPrice?: number }
  ) {
    return this.shopsService.addItemToShop(shopId, data.itemId, data.shopPrice);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/shops/:shopId/items/:itemId')
  @ApiOperation({ summary: 'Admin: Remove item from shop' })
  removeItemFromShop(@Param('shopId') shopId: string, @Param('itemId') itemId: string) {
    return this.shopsService.removeItemFromShop(shopId, itemId);
  }
}
