"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastTransport = exports.BaseEvent = void 0;
class BaseEvent {
    constructor() {
        this.timestamp = new Date();
        this.eventId = this.generateEventId();
    }
    generateEventId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.BaseEvent = BaseEvent;
var BroadcastTransport;
(function (BroadcastTransport) {
    BroadcastTransport["WEBSOCKET"] = "websocket";
    BroadcastTransport["REDIS"] = "redis";
    BroadcastTransport["SSE"] = "sse";
    BroadcastTransport["WEBHOOK"] = "webhook";
    BroadcastTransport["PUSHER"] = "pusher";
    BroadcastTransport["SOCKET_IO"] = "socket_io";
})(BroadcastTransport || (exports.BroadcastTransport = BroadcastTransport = {}));
//# sourceMappingURL=base-event.js.map