import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Config')
@Controller()
export class ConfigController {
  constructor(private configService: ConfigService) {}

  // Public endpoint
  @Get('config/public')
  @ApiOperation({ summary: 'Get public configuration' })
  getPublicConfig() {
    return this.configService.getPublicConfig();
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin/config')
  @ApiOperation({ summary: 'Admin: Get all configuration' })
  getAllConfig() {
    return this.configService.getAllConfig();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Put('admin/config/:key')
  @ApiOperation({ summary: 'Admin: Update configuration' })
  updateConfig(
    @Param('key') key: string,
    @Body() data: { value: any; description?: string }
  ) {
    return this.configService.updateConfig(key, data.value, data.description);
  }
}
