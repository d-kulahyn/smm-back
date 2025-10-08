export declare class HealthResponseDto {
    status: string;
    timestamp: string;
    uptime: number;
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
        arrayBuffers: number;
    };
    version: string;
    environment: string;
}
