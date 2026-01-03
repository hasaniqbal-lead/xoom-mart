import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  async adminLogin(@Body() body: { email: string; password: string }) {
    return this.authService.adminLogin(body.email, body.password);
  }

  @Post('rider/login')
  @ApiOperation({ summary: 'Rider login' })
  async riderLogin(@Body() body: { phone: string; password: string }) {
    return this.authService.riderLogin(body.phone, body.password);
  }
}
