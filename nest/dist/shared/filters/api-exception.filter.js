"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ApiExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../exceptions");
const exceptions_2 = require("../exceptions");
let ApiExceptionFilter = ApiExceptionFilter_1 = class ApiExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(ApiExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status;
        let errorResponse;
        if (exception instanceof exceptions_1.ApiException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            errorResponse = {
                success: false,
                message: exceptionResponse.message,
                errorCode: exceptionResponse.errorCode,
                statusCode: status,
                timestamp: exceptionResponse.timestamp,
                path: request.url,
                method: request.method,
            };
            if (exception instanceof exceptions_2.ValidationException) {
                errorResponse.errors = exceptionResponse.details;
            }
            else if (exceptionResponse.details) {
                errorResponse.details = exceptionResponse.details;
            }
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            errorResponse = {
                success: false,
                message: typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : exceptionResponse.message || 'An error occurred',
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };
            if (status === common_1.HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object') {
                const response = exceptionResponse;
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
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = {
                success: false,
                message: 'Internal server error',
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };
            this.logger.error(`Unexpected error: ${exception}`, exception instanceof Error ? exception.stack : undefined);
        }
        if (status >= 400 && status < 500) {
            this.logger.warn(`Client error: ${status} - ${errorResponse.message}`, {
                path: request.url,
                method: request.method,
                statusCode: status,
            });
        }
        else if (status >= 500) {
            this.logger.error(`Server error: ${status} - ${errorResponse.message}`, {
                path: request.url,
                method: request.method,
                statusCode: status,
            });
        }
        response.status(status).json(errorResponse);
    }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = ApiExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
//# sourceMappingURL=api-exception.filter.js.map