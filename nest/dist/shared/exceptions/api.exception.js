"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiException = void 0;
const common_1 = require("@nestjs/common");
class ApiException extends common_1.HttpException {
    constructor(message, statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR, errorCode, details) {
        super({
            message,
            error: 'API Error',
            statusCode,
            errorCode,
            details,
            timestamp: new Date().toISOString(),
        }, statusCode);
        this.errorCode = errorCode;
        this.details = details;
    }
}
exports.ApiException = ApiException;
//# sourceMappingURL=api.exception.js.map