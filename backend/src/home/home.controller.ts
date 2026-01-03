import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HomeService } from './home.service';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get()
  @ApiOperation({ summary: 'Get home page data' })
  getHomeData() {
    return this.homeService.getHomeData();
  }
}
