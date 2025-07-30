import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICER',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(
            process.cwd(),
            'libs',
            'proto-definitions',
            'src',
            'user',
            'user.proto',
          ),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
