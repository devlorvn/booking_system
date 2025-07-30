import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientGrpc } from '@nestjs/microservices';
import {
  User,
  UserServiceClient,
} from '@app/proto-definitions/generated/user/user';
import { Observable } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(
    private readonly apiGatewayService: AppService,
    @Inject('USER_SERVICER') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string): Observable<User> {
    console.log(`API Gateway: Calling GetUserById for ID: ${id}`);
    return this.userService.getUserById({ id });
  }
}
