import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    super(
      {
        message,
        error: 'API Error',
        statusCode,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }
}
