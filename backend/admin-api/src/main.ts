import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 添加 CORS
  app.use(cors());
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Admin API is running on: http://localhost:${port}`);
}
bootstrap(); 