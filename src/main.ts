import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const port = Number(process.env.PORT)
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // const port = configService.get<number>(()) ;
  await app.listen(port);
  console.log(`Server is running on ${port}`);
}
await bootstrap();
