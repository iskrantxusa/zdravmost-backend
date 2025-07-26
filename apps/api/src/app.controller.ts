import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { AppService } from './app.service';
import { CustomLoggerService } from './common/logger/logger.service';

class TestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello endpoint called');
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    this.logger.log('Health check endpoint called');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'zdravmost-api',
    };
  }

  @Post('test-validation')
  testValidation(@Body() testDto: TestDto) {
    this.logger.log('Test validation endpoint called', { data: testDto });
    return {
      message: 'Validation passed!',
      data: testDto,
    };
  }

  @Get('test-error')
  testError() {
    this.logger.log('Test error endpoint called');
    throw new BadRequestException('This is a test error to demonstrate error handling');
  }
}
