import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const protoPathResolved = join(
    process.cwd(),
    'libs',
    'proto-definitions',
    'src',
    'user',
    'user.proto',
  );
  console.log(
    `[DEBUG] User Service protoPath resolved to: ${protoPathResolved}`,
  ); // <--- THÊM DÒNG NÀY

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
  console.log('User service (gRPC) is listening on port 50051');
}
bootstrap();
