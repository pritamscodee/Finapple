import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Allow comma-separated origins from env, e.g.
  // CORS_ORIGIN=https://finapple.netlify.app,https://finapple.vercel.app
  const rawOrigins = process.env.CORS_ORIGIN || 'https://finnappl.netlify.app';
  const allowedOrigins = rawOrigins.split(',').map((o: string) => o.trim().replace(/\/$/, ''));

  app.enableCors({
    origin: (origin, callback) => {
      // its  Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
