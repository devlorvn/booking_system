import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const protoPathResolved = join(
    process.cwd(),
    'libs',
    'proto-definitions',
    'src',
    'user',
    'user.proto',
  );
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: protoPathResolved,
        url: 'localhost:50051',
      },
    },
  );

  await app.listen();
  console.log(
    'User service (gRPC) is listening on port',
    process.env.USER_SERVICE_PORT,
  );
}
bootstrap();
