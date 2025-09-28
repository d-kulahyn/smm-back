export class Logger {
    constructor(level = 'info') {
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
        this.currentLevel = this.levels[level] || this.levels.info;
    }

    _shouldLog(level) {
        return this.levels[level] <= this.currentLevel;
    }

    _formatMessage(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const levelStr = level.toUpperCase().padEnd(5);
        return `[${timestamp}] ${levelStr} ${message}`;
    }

    error(message, ...args) {
        if (this._shouldLog('error')) {
            console.error(this._formatMessage('error', message), ...args);
        }
    }

    warn(message, ...args) {
        if (this._shouldLog('warn')) {
            console.warn(this._formatMessage('warn', message), ...args);
        }
    }

    info(message, ...args) {
        if (this._shouldLog('info')) {
            console.log(this._formatMessage('info', message), ...args);
        }
    }

    debug(message, ...args) {
        if (this._shouldLog('debug')) {
            console.log(this._formatMessage('debug', message), ...args);
        }
    }
}
