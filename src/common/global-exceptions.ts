import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { UAParser } from 'ua-parser-js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const timeStamp = new Date().toISOString();

    //* Parse device info
    const userAgent = req.headers['user-agent'] || '';
    const ua = new UAParser(userAgent);
    const browser = ua.getBrowser();
    const os = ua.getOS();
    const device = ua.getDevice();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorMessages: { path: string; message: string }[] = [];

    //* Prisma Errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        message = (exception.meta?.cause as string) || 'Record not found!';
        errorMessages = [{ path: '', message }];
        statusCode = HttpStatus.NOT_FOUND;
      } else if (exception.code === 'P2003') {
        if (exception.message.includes('delete()` invocation:')) {
          message = 'Delete failed due to foreign key constraint';
          errorMessages = [{ path: '', message }];
          statusCode = HttpStatus.BAD_REQUEST;
        }
      }
    }

    //* NestJS HTTP Exceptions
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
        errorMessages = [{ path: '', message }];
      } else if (typeof response === 'object' && response !== null) {
        const resObj = response as Record<string, any>;
        message = resObj.message || message;

        if (Array.isArray(resObj.message)) {
          errorMessages = resObj.message.map((msg: string) => ({
            path: '',
            message: msg,
          }));
        } else {
          errorMessages = [{ path: '', message }];
        }
      }
    }

    //* General Errors
    else if (exception instanceof Error) {
      message = exception.message;
      errorMessages = [{ path: '', message }];
    }

    const stackArray =
      exception?.stack?.split('\n').map((line) => line.trim()) || [];

    res.status(statusCode).json({
      statusCode,
      success: false,
      message: Array.isArray(message) ? message.at(0) : message,
      errorMessages,
      stack: stackArray,
      client: {
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
        os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
        device: device.type || 'desktop',
      },
      timeStamp,
    });
  }
}
