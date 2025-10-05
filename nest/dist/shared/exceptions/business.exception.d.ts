import { ApiException } from './api.exception';
export declare class BusinessException extends ApiException {
    constructor(message: string, errorCode?: string, details?: any);
}
export declare class ResourceNotFoundException extends ApiException {
    constructor(resource: string, identifier?: string);
}
export declare class AccessDeniedException extends ApiException {
    constructor(message?: string);
}
export declare class UnauthorizedException extends ApiException {
    constructor(message?: string);
}
export declare class ValidationException extends ApiException {
    readonly errors: any;
    constructor(message: string, errors?: any);
    static fromValidationErrors(errors: any[]): ValidationException;
}
