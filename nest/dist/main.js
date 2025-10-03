"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const api_exception_filter_1 = require("./shared/filters/api-exception.filter");
const validation_pipe_1 = require("./shared/pipes/validation.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new api_exception_filter_1.ApiExceptionFilter());
    app.useGlobalPipes(new validation_pipe_1.GlobalValidationPipe());
    app.enableCors();
    app.setGlobalPrefix('v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SMM API')
        .setDescription('The SMM API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(process.env.PORT || 3000);
    console.log('Application is running on: http://localhost:3000');
    console.log('Swagger UI available at: http://localhost:3000/api-docs');
}
bootstrap();
//# sourceMappingURL=main.js.map