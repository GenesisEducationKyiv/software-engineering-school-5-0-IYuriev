import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
dotenv.config({ path: '.env.weather' });

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'weather',
        protoPath: join(__dirname, '../../../libs/proto/src/weather.proto'),
        url: `0.0.0.0:${port}`,
      },
    },
  );

  await app.listen();
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap in Weather app:', err);
  process.exit(1);
});
