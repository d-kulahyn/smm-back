import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './shared/filters/api-exception.filter';
import { GlobalValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(new GlobalValidationPipe());

  // CORS
  app.enableCors();

  // API prefix
  app.setGlobalPrefix('v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SMM API')
    .setDescription('The SMM API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger UI available at: http://localhost:3000/api-docs');
}
bootstrap();
