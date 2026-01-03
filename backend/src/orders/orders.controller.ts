import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // Public endpoints
  @Post('orders')
  @ApiOperation({ summary: 'Create order (guest checkout)' })
  createOrder(@Body() data: any) {
    return this.ordersService.createOrder(data);
  }

  @Get('orders/track')
  @ApiOperation({ summary: 'Track order by phone and order number' })
  trackOrder(@Query('phone') phone: string, @Query('orderNumber') orderNumber: string) {
    return this.ordersService.trackOrder(phone, orderNumber);
  }

  @Post('orders/:id/feedback')
  @ApiOperation({ summary: 'Submit order feedback' })
  submitFeedback(
    @Param('id') id: string,
    @Body() data: { rating: number; comment?: string }
  ) {
    return this.ordersService.submitFeedback(id, data.rating, data.comment);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/orders')
  @ApiOperation({ summary: 'Admin: Get all orders' })
  getAllOrders(@Query() filters: any) {
    return this.ordersService.getAllOrders(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/orders/stats')
  @ApiOperation({ summary: 'Admin: Get order statistics' })
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/orders/:id')
  @ApiOperation({ summary: 'Admin: Get order by ID' })
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/orders/:id/status')
  @ApiOperation({ summary: 'Admin: Update order status' })
  updateOrderStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.ordersService.updateOrderStatus(id, data.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/orders/:id/assign-rider')
  @ApiOperation({ summary: 'Admin: Assign rider to order' })
  assignRider(@Param('id') id: string, @Body() data: { riderId: string }) {
    return this.ordersService.assignRider(id, data.riderId);
  }

  // Rider endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RIDER')
  @ApiBearerAuth()
  @Get('rider/orders')
  @ApiOperation({ summary: 'Rider: Get assigned orders' })
  getRiderOrders(@Request() req) {
    return this.ordersService.getRiderOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RIDER')
  @ApiBearerAuth()
  @Get('rider/orders/:id')
  @ApiOperation({ summary: 'Rider: Get order details' })
  getRiderOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RIDER')
  @ApiBearerAuth()
  @Put('rider/orders/:id/status')
  @ApiOperation({ summary: 'Rider: Update order status' })
  updateOrderStatusByRider(
    @Param('id') id: string,
    @Body() data: { status: string },
    @Request() req
  ) {
    return this.ordersService.updateOrderStatusByRider(id, req.user.id, data.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RIDER')
  @ApiBearerAuth()
  @Put('rider/orders/:id/collect-cod')
  @ApiOperation({ summary: 'Rider: Mark COD collected' })
  collectCOD(@Param('id') id: string, @Request() req) {
    return this.ordersService.collectCOD(id, req.user.id);
  }
}
