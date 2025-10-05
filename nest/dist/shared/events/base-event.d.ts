export declare abstract class BaseEvent {
    readonly timestamp: Date;
    readonly eventId: string;
    constructor();
    abstract getEventName(): string;
    abstract getPayload(): Record<string, any>;
    abstract getBroadcastChannels(): string[];
    abstract getBroadcastTransports(): BroadcastTransport[];
    private generateEventId;
}
export declare enum BroadcastTransport {
    WEBSOCKET = "websocket",
    REDIS = "redis",
    SSE = "sse",
    WEBHOOK = "webhook",
    PUSHER = "pusher",
    SOCKET_IO = "socket_io"
}
