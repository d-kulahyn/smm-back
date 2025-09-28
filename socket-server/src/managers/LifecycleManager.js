export class LifecycleManager {
    constructor(logger) {
        this.logger = logger;
        this.shutdownCallbacks = [];
        this.isShuttingDown = false;
        this._setupSignalHandlers();
    }

    onShutdown(callback) {
        if (typeof callback === 'function') {
            this.shutdownCallbacks.push(callback);
        }
    }

    async gracefulShutdown(signal = 'UNKNOWN') {
        if (this.isShuttingDown) {
            this.logger.warn('Shutdown already in progress');
            return;
        }

        this.isShuttingDown = true;
        this.logger.info(`🛑 Received ${signal}, shutting down gracefully...`);

        try {
            await Promise.all(
                this.shutdownCallbacks.map(async (callback, index) => {
                    try {
                        await callback();
                        this.logger.debug(`Shutdown callback ${index} completed`);
                    } catch (error) {
                        this.logger.error(`Shutdown callback ${index} failed:`, error);
                    }
                })
            );

            this.logger.info('✅ Graceful shutdown completed');
            process.exit(0);

        } catch (error) {
            this.logger.error('❌ Error during graceful shutdown:', error);
            process.exit(1);
        }
    }

    _setupSignalHandlers() {
        process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));

        process.on('uncaughtException', (error) => {
            this.logger.error('Uncaught Exception:', error);
            this.gracefulShutdown('UNCAUGHT_EXCEPTION');
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            this.gracefulShutdown('UNHANDLED_REJECTION');
        });

        setTimeout(() => {
            if (this.isShuttingDown) {
                this.logger.warn('⚠️ Forcing shutdown after timeout');
                process.exit(1);
            }
        }, 10000);
    }
}
