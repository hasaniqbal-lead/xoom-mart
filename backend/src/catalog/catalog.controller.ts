import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Catalog')
@Controller()
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  // Public endpoints
  @Get('categories')
  @ApiOperation({ summary: 'Get all active categories' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.catalogService.getCategoryBySlug(slug);
  }

  @Get('subcategories/:slug')
  @ApiOperation({ summary: 'Get subcategory by slug' })
  getSubcategoryBySlug(@Param('slug') slug: string) {
    return this.catalogService.getSubcategoryBySlug(slug);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get items with filters' })
  getItems(@Query() filters: any) {
    return this.catalogService.getItems(filters);
  }

  @Get('items/search')
  @ApiOperation({ summary: 'Search items' })
  searchItems(@Query('q') query: string) {
    return this.catalogService.searchItems(query);
  }

  @Get('items/deals')
  @ApiOperation({ summary: 'Get deal items' })
  getDealItems() {
    return this.catalogService.getDealItems();
  }

  @Get('items/:slug')
  @ApiOperation({ summary: 'Get item by slug' })
  getItemBySlug(@Param('slug') slug: string) {
    return this.catalogService.getItemBySlug(slug);
  }

  // Admin endpoints - Categories
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/categories')
  @ApiOperation({ summary: 'Admin: Get all categories' })
  getAllCategoriesAdmin() {
    return this.catalogService.getAllCategoriesAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/categories')
  @ApiOperation({ summary: 'Admin: Create category' })
  createCategory(@Body() data: any) {
    return this.catalogService.createCategory(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/categories/:id')
  @ApiOperation({ summary: 'Admin: Update category' })
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateCategory(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/categories/:id')
  @ApiOperation({ summary: 'Admin: Delete category' })
  deleteCategory(@Param('id') id: string) {
    return this.catalogService.deleteCategory(id);
  }

  // Admin endpoints - Subcategories
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/subcategories')
  @ApiOperation({ summary: 'Admin: Create subcategory' })
  createSubcategory(@Body() data: any) {
    return this.catalogService.createSubcategory(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/subcategories/:id')
  @ApiOperation({ summary: 'Admin: Update subcategory' })
  updateSubcategory(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateSubcategory(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/subcategories/:id')
  @ApiOperation({ summary: 'Admin: Delete subcategory' })
  deleteSubcategory(@Param('id') id: string) {
    return this.catalogService.deleteSubcategory(id);
  }

  // Admin endpoints - Items
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/items')
  @ApiOperation({ summary: 'Admin: Get all items' })
  getAllItemsAdmin(@Query() filters: any) {
    return this.catalogService.getAllItemsAdmin(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post('admin/items')
  @ApiOperation({ summary: 'Admin: Create item' })
  createItem(@Body() data: any) {
    return this.catalogService.createItem(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/items/:id')
  @ApiOperation({ summary: 'Admin: Update item' })
  updateItem(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.updateItem(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete('admin/items/:id')
  @ApiOperation({ summary: 'Admin: Delete item' })
  deleteItem(@Param('id') id: string) {
    return this.catalogService.deleteItem(id);
  }
}
