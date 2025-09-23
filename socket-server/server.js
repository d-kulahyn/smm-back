import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './socket/index.js';
import Redis from "ioredis";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

let redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: process.env.REDIS_DB || 1,
});

await redis.psubscribe('*', (err, count) => {
    if (err) {
        console.error('Failed to subscribe to Redis channel:', err);
    } else {
        console.log(`Subscribed to ${count} Redis channels`);
    }
});

redis.on('pmessage', (pattern, channel, message) => {
    console.log(`🔔 Redis message on room ${channel}:`, message);
    io.to(channel).emit('room:message', {
        from: 'service',
        message,
        roomId: channel
    })
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    registerSocketHandlers(socket, io, redis);
});

const PORT = 3000;
const HOST = '0.0.0.0';
httpServer.listen(PORT, HOST,() => {
    console.log(`Socket server running on https://${HOST}:${PORT}`);
});
