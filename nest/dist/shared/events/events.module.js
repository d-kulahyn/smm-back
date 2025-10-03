"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const event_broadcast_service_1 = require("./event-broadcast.service");
const websocket_broadcaster_1 = require("../broadcasting/websocket-broadcaster");
const redis_broadcaster_1 = require("../broadcasting/redis-broadcaster");
const redis_service_1 = require("../../infrastructure/services/redis.service");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            redis_service_1.RedisService,
            event_broadcast_service_1.EventBroadcastService,
            websocket_broadcaster_1.WebSocketBroadcaster,
            redis_broadcaster_1.RedisBroadcaster,
        ],
        exports: [event_broadcast_service_1.EventBroadcastService, redis_service_1.RedisService],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map