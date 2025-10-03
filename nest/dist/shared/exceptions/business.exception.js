"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.UnauthorizedException = exports.AccessDeniedException = exports.ResourceNotFoundException = exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
const api_exception_1 = require("./api.exception");
class BusinessException extends api_exception_1.ApiException {
    constructor(message, errorCode, details) {
        super(message, common_1.HttpStatus.BAD_REQUEST, errorCode, details);
    }
}
exports.BusinessException = BusinessException;
class ResourceNotFoundException extends api_exception_1.ApiException {
    constructor(resource, identifier) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, common_1.HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND', { resource, identifier });
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
class AccessDeniedException extends api_exception_1.ApiException {
    constructor(message = 'Access denied') {
        super(message, common_1.HttpStatus.FORBIDDEN, 'ACCESS_DENIED');
    }
}
exports.AccessDeniedException = AccessDeniedException;
class UnauthorizedException extends api_exception_1.ApiException {
    constructor(message = 'Unauthorized') {
        super(message, common_1.HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ValidationException extends api_exception_1.ApiException {
    constructor(message, errors = {}) {
        super(message, common_1.HttpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', errors);
        this.errors = errors;
    }
    static fromValidationErrors(errors) {
        const formattedErrors = {};
        errors.forEach(error => {
            if (error.property) {
                formattedErrors[error.property] = Object.values(error.constraints || {});
            }
        });
        return new ValidationException('Validation failed', formattedErrors);
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=business.exception.js.map