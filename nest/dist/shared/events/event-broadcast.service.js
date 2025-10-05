"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBroadcastService = void 0;
const common_1 = require("@nestjs/common");
const websocket_broadcaster_1 = require("../broadcasting/websocket-broadcaster");
const redis_broadcaster_1 = require("../broadcasting/redis-broadcaster");
let EventBroadcastService = class EventBroadcastService {
    constructor(webSocketBroadcaster, redisBroadcaster) {
        this.webSocketBroadcaster = webSocketBroadcaster;
        this.redisBroadcaster = redisBroadcaster;
        this.broadcasters = new Map();
        this.registerBroadcaster(this.webSocketBroadcaster);
        this.registerBroadcaster(this.redisBroadcaster);
    }
    registerBroadcaster(broadcaster) {
        this.broadcasters.set(broadcaster.getTransportType(), broadcaster);
    }
    async broadcast(event) {
        const channels = event.getBroadcastChannels();
        const transports = event.getBroadcastTransports();
        console.log(`Broadcasting event ${event.getEventName()} to channels:`, channels);
        console.log(`Using transports:`, transports);
        const broadcastPromises = transports.map(async (transport) => {
            const broadcaster = this.broadcasters.get(transport);
            if (!broadcaster) {
                console.warn(`Broadcaster for transport ${transport} not found`);
                return;
            }
            try {
                await broadcaster.broadcast(event, channels);
                console.log(`Successfully broadcasted via ${transport}`);
            }
            catch (error) {
                console.error(`Failed to broadcast via ${transport}:`, error);
            }
        });
        await Promise.allSettled(broadcastPromises);
    }
    async broadcastToUser(userId, event) {
        const transports = event.getBroadcastTransports();
        const broadcastPromises = transports.map(async (transport) => {
            const broadcaster = this.broadcasters.get(transport);
            if (!broadcaster) {
                console.warn(`Broadcaster for transport ${transport} not found`);
                return;
            }
            try {
                await broadcaster.broadcastToUser(userId, event);
                console.log(`Successfully broadcasted to user ${userId} via ${transport}`);
            }
            catch (error) {
                console.error(`Failed to broadcast to user ${userId} via ${transport}:`, error);
            }
        });
        await Promise.allSettled(broadcastPromises);
    }
    async broadcastToChannel(channel, event) {
        const transports = event.getBroadcastTransports();
        const broadcastPromises = transports.map(async (transport) => {
            const broadcaster = this.broadcasters.get(transport);
            if (!broadcaster) {
                console.warn(`Broadcaster for transport ${transport} not found`);
                return;
            }
            try {
                await broadcaster.broadcastToChannel(channel, event);
                console.log(`Successfully broadcasted to channel ${channel} via ${transport}`);
            }
            catch (error) {
                console.error(`Failed to broadcast to channel ${channel} via ${transport}:`, error);
            }
        });
        await Promise.allSettled(broadcastPromises);
    }
};
exports.EventBroadcastService = EventBroadcastService;
exports.EventBroadcastService = EventBroadcastService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_broadcaster_1.WebSocketBroadcaster,
        redis_broadcaster_1.RedisBroadcaster])
], EventBroadcastService);
//# sourceMappingURL=event-broadcast.service.js.map