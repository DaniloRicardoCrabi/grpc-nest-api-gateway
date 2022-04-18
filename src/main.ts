import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log('List on localhost port 3000');
}
bootstrap();
