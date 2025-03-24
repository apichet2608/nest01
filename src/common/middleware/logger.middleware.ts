import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);

    // Add response listener
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - startTime;

      // Log based on status code
      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}

// Clean functional middleware alternative
export function logger(req: Request, res: Response, next: NextFunction): void {
  const nestLogger = new Logger('HTTP');
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || '';
  const startTime = Date.now();

  // Log request
  nestLogger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);

  // Add response listener
  res.on('finish', () => {
    const { statusCode } = res;
    const contentLength = res.get('content-length') || 0;
    const responseTime = Date.now() - startTime;

    // Log based on status code
    const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${responseTime}ms`;

    if (statusCode >= 500) {
      nestLogger.error(logMessage);
    } else if (statusCode >= 400) {
      nestLogger.warn(logMessage);
    } else {
      nestLogger.log(logMessage);
    }
  });

  next();
}
