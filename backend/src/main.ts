import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: 0.1, // Adjust as needed
      profilesSampleRate: 0.1,
    });
  }

  const app = await NestFactory.create(AppModule, { cors: true });
  
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
