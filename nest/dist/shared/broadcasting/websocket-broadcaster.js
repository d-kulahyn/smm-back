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
exports.WebSocketBroadcaster = void 0;
const common_1 = require("@nestjs/common");
const base_broadcaster_1 = require("./base-broadcaster");
const base_event_1 = require("../events/base-event");
let WebSocketBroadcaster = class WebSocketBroadcaster extends base_broadcaster_1.BaseBroadcaster {
    constructor() {
        super();
    }
    getTransportType() {
        return base_event_1.BroadcastTransport.WEBSOCKET;
    }
    async broadcast(event, channels, options) {
        const message = {
            event: event.getEventName(),
            data: event.getPayload(),
            channels,
            timestamp: event.timestamp,
            eventId: event.eventId
        };
        for (const channel of channels) {
            await this.broadcastToChannel(channel, event, options);
        }
    }
    async broadcastToUser(userId, event, options) {
        console.log(`Broadcasting to user ${userId}:`, event.getEventName());
    }
    async broadcastToChannel(channel, event, options) {
        console.log(`Broadcasting to channel ${channel}:`, event.getEventName());
    }
};
exports.WebSocketBroadcaster = WebSocketBroadcaster;
exports.WebSocketBroadcaster = WebSocketBroadcaster = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WebSocketBroadcaster);
//# sourceMappingURL=websocket-broadcaster.js.map