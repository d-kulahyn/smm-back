import { HttpException, HttpStatus } from '@nestjs/common';
export declare class ApiException extends HttpException {
    readonly errorCode?: string;
    readonly details?: any;
    constructor(message: string, statusCode?: HttpStatus, errorCode?: string, details?: any);
}
