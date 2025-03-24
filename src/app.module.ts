import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available throughout the application
      envFilePath: '.env', // Specify the path to your .env file
    }),
    DatabaseModule,
    SmartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
