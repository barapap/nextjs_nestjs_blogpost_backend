import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per window
      message: 'Too many requests, please try again later.', // Custom error message
    }),
  );

  // Enable CORS for requests from frontend (http://localhost:3001)
  app.enableCors({
    origin: 'http://localhost:3001', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, headers)
  });

  await app.listen(3000);
}
bootstrap();
