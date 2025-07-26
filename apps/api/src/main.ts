import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { CustomLoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Apply Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Setup ConfigService and Validators
  const configService = app.get(ConfigService);

  // Use global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(app.get(CustomLoggerService)));

  // Use global response transformation interceptor
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Start server
  const host = configService.get('HOST', 'localhost');
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, () => {
    const logger = app.get(CustomLoggerService);
    logger.log(`Application is running on: http://${host}:${port}`);
  });
}
bootstrap();
