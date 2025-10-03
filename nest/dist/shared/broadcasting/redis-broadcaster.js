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
exports.RedisBroadcaster = void 0;
const common_1 = require("@nestjs/common");
const base_broadcaster_1 = require("./base-broadcaster");
const events_1 = require("../events");
const redis_service_1 = require("../../infrastructure/services/redis.service");
let RedisBroadcaster = class RedisBroadcaster extends base_broadcaster_1.BaseBroadcaster {
    constructor(redisService) {
        super();
        this.redisService = redisService;
    }
    getTransportType() {
        return events_1.BroadcastTransport.REDIS;
    }
    async broadcast(event, channels, options) {
        for (const channel of channels) {
            await this.broadcastToChannel(channel, event, options);
        }
    }
    async broadcastToUser(userId, event, options) {
        const userChannel = `user.${userId}`;
        await this.broadcastToChannel(userChannel, event, options);
    }
    async broadcastToChannel(channel, event, options) {
        try {
            const payload = event.getPayload();
            const streamData = {
                event: event.getEventName(),
                channel: channel,
                timestamp: event.timestamp.toISOString(),
                eventId: event.eventId,
                payload: JSON.stringify(payload),
                transport: this.getTransportType(),
                ...options
            };
            const streamName = `events:${channel}`;
            const messageId = await this.redisService.addToStream(streamName, streamData, {
                maxLen: 10000
            });
            console.log(`Redis Stream: Event '${event.getEventName()}' added to stream '${streamName}' with ID: ${messageId}`);
        }
        catch (error) {
            console.error(`Failed to broadcast event to Redis Stream for channel ${channel}:`, error);
            throw error;
        }
    }
};
exports.RedisBroadcaster = RedisBroadcaster;
exports.RedisBroadcaster = RedisBroadcaster = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RedisBroadcaster);
//# sourceMappingURL=redis-broadcaster.js.map