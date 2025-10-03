import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {ApiException} from '../exceptions';
import {ValidationException} from '../exceptions';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ApiExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let errorResponse: any;

        if (exception instanceof ApiException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse() as any;

            errorResponse = {
                success: false,
                message: exceptionResponse.message,
                errorCode: exceptionResponse.errorCode,
                statusCode: status,
                timestamp: exceptionResponse.timestamp,
                path: request.url,
                method: request.method,
            };

            // Добавляем детали для ValidationException
            if (exception instanceof ValidationException) {
                errorResponse.errors = exceptionResponse.details;
            } else if (exceptionResponse.details) {
                errorResponse.details = exceptionResponse.details;
            }

        } else if (exception instanceof HttpException) {
            // Стандартные HTTP исключения NestJS
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            errorResponse = {
                success: false,
                message: typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as any).message || 'An error occurred',
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };

            // Обработка ошибок валидации от class-validator
            if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object') {
                const response = exceptionResponse as any;
                if (response.message && Array.isArray(response.message)) {
                    const validationErrors = {};
                    response.message.forEach(error => {
                        if (typeof error === 'string') {
                            validationErrors['general'] = validationErrors['general'] || [];
                            validationErrors['general'].push(error);
                        }
                    });
                    errorResponse.errors = validationErrors;
                }
            }
        } else {
            // Неожиданные ошибки
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = {
                success: false,
                message: 'Internal server error',
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };

            // Логируем неожиданные ошибки
            this.logger.error(
                `Unexpected error: ${exception}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        // Логируем ошибки клиента (4xx) как предупреждения, серверные (5xx) как ошибки
        if (status >= 400 && status < 500) {
            this.logger.warn(`Client error: ${status} - ${errorResponse.message}`, {
                path: request.url,
                method: request.method,
                statusCode: status,
            });
        } else if (status >= 500) {
            this.logger.error(`Server error: ${status} - ${errorResponse.message}`, {
                path: request.url,
                method: request.method,
                statusCode: status,
            });
        }

        response.status(status).json(errorResponse);
    }
}
