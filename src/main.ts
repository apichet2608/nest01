import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // เปิดใช้งาน CORS
  app.enableCors({
    origin: '*', // หรือระบุโดเมนที่อนุญาต เช่น 'https://yourdomain.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
