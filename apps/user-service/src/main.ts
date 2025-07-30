import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(
          __dirname,
          '..',
          '..',
          '..',
          'libs',
          'proto-definitions',
        ),
        url: 'localhost:50051',
      },
    },
  );
  await app.listen();
  console.log('User service (gRPC) is listening on port 50051');
}
bootstrap();
