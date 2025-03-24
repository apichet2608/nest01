import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SmartModule } from './smart/smart.module';
import { DatabaseModule } from './config/pgsql/database.module';

interface MiddlewareConsumer {
  apply(...middlewares: any[]): this;
  forRoutes(...args: any[]): this;
}

@Module({
  imports: [SmartModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
