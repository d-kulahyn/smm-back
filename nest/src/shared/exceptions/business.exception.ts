import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class BusinessException extends ApiException {
  constructor(message: string, errorCode?: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, errorCode, details);
  }
}

export class ResourceNotFoundException extends ApiException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND', { resource, identifier });
  }
}

export class AccessDeniedException extends ApiException {
  constructor(message: string = 'Access denied') {
    super(message, HttpStatus.FORBIDDEN, 'ACCESS_DENIED');
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ValidationException extends ApiException {
  constructor(message: string, public readonly errors: any = {}) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', errors);
  }

  static fromValidationErrors(errors: any[]): ValidationException {
    const formattedErrors = {};
    errors.forEach(error => {
      if (error.property) {
        formattedErrors[error.property] = Object.values(error.constraints || {});
      }
    });

    return new ValidationException('Validation failed', formattedErrors);
  }
}
