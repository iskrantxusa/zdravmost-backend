import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      if (typeof errorResponse === 'string') {
        message = errorResponse;
        error = exception.name;
      } else {
        message = (errorResponse as any)?.message || 'Internal server error';
        error = (errorResponse as any)?.error || exception.name;
      }
    } else if (exception instanceof Error) {
      // Handle other types of errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = exception.name;
      
      // Log the full error details for debugging
      this.logger.error('Unhandled error occurred', {
        error: exception.message,
        stack: exception.stack,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Handle unknown exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'UnknownError';
      
      this.logger.error('Unknown exception occurred', {
        exception,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      });
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Log HTTP errors (4xx) as warnings, server errors (5xx) as errors
    if (status >= 500) {
      this.logger.error('Server error occurred', {
        ...errorResponse,
        userAgent: request.get('user-agent'),
        ip: request.ip,
      });
    } else if (status >= 400) {
      this.logger.warn('Client error occurred', {
        ...errorResponse,
        userAgent: request.get('user-agent'),
        ip: request.ip,
      });
    }

    response.status(status).json(errorResponse);
  }
}
