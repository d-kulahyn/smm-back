"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCreatedEvent = void 0;
const base_event_1 = require("./base-event");
class ChatCreatedEvent extends base_event_1.BaseEvent {
    constructor(chat, creatorId, projectId) {
        super();
        this.chat = chat;
        this.creatorId = creatorId;
        this.projectId = projectId;
    }
    getEventName() {
        return 'chat.created';
    }
    getPayload() {
        return {
            chat: {
                id: this.chat.id,
                name: this.chat.name,
                description: this.chat.description,
                projectId: this.chat.projectId,
                creatorId: this.chat.creatorId,
                isGroup: this.chat.isGroup,
                createdAt: this.chat.createdAt
            },
            creatorId: this.creatorId,
            projectId: this.projectId,
            timestamp: this.timestamp,
            eventId: this.eventId
        };
    }
    getBroadcastChannels() {
        return [
            `project.${this.projectId}`,
            `user.${this.creatorId}`
        ];
    }
    getBroadcastTransports() {
        return [
            base_event_1.BroadcastTransport.WEBSOCKET,
            base_event_1.BroadcastTransport.REDIS
        ];
    }
}
exports.ChatCreatedEvent = ChatCreatedEvent;
//# sourceMappingURL=chat-created.event.js.map