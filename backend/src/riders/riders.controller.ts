import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RidersService } from './riders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Riders')
@Controller('admin/riders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class RidersController {
  constructor(private ridersService: RidersService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: Get all riders' })
  getAllRiders() {
    return this.ridersService.getAllRiders();
  }

  @Post()
  @ApiOperation({ summary: 'Admin: Create rider' })
  createRider(@Body() data: { name: string; phone: string; password: string }) {
    return this.ridersService.createRider(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Admin: Update rider' })
  updateRider(@Param('id') id: string, @Body() data: any) {
    return this.ridersService.updateRider(id, data);
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: 'Admin: Toggle rider active status' })
  toggleRider(@Param('id') id: string) {
    return this.ridersService.toggleRider(id);
  }
}
