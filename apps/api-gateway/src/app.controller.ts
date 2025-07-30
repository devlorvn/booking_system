import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly apiGatewayService: AppService) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }
}
