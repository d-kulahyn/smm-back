import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './shared/filters/api-exception.filter';
import { GlobalValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(new GlobalValidationPipe());

  // CORS - разрешить для всех origins
  app.enableCors({
    origin: true, // Разрешить любой origin с credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('v1');

  // Swagger documentation (без префикса, чтобы был доступен по /api-docs)
  const config = new DocumentBuilder()
    .setTitle('SMM API')
    .setDescription('The SMM API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/api-docs`);
}
bootstrap();
