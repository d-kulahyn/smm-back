import { Module } from '@nestjs/common';
import { EventBroadcastService } from './event-broadcast.service';
import { WebSocketBroadcaster } from '../broadcasting/websocket-broadcaster';
import { RedisBroadcaster } from '../broadcasting/redis-broadcaster';
import { RedisService } from '../../infrastructure/services/redis.service';

@Module({
  providers: [
    RedisService,
    EventBroadcastService,
    WebSocketBroadcaster,
    RedisBroadcaster,
  ],
  exports: [EventBroadcastService, RedisService],
})
export class EventsModule {}
