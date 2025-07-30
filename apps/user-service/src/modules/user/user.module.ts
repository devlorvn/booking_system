import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  // providers: [UserController],
})
export class UserModule {}
