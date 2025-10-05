"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLeftChatEvent = void 0;
const base_event_1 = require("./base-event");
class UserLeftChatEvent extends base_event_1.BaseEvent {
    constructor(chatId, userId, removedBy, projectId) {
        super();
        this.chatId = chatId;
        this.userId = userId;
        this.removedBy = removedBy;
        this.projectId = projectId;
    }
    getEventName() {
        return 'chat.user.left';
    }
    getPayload() {
        return {
            chatId: this.chatId,
            userId: this.userId,
            removedBy: this.removedBy,
            projectId: this.projectId,
            timestamp: this.timestamp,
            eventId: this.eventId
        };
    }
    getBroadcastChannels() {
        return [
            `project.${this.projectId}`,
            `chat.${this.chatId}`,
            `user.${this.userId}`,
            `user.${this.removedBy}`
        ];
    }
    getBroadcastTransports() {
        return [
            base_event_1.BroadcastTransport.WEBSOCKET,
            base_event_1.BroadcastTransport.REDIS
        ];
    }
}
exports.UserLeftChatEvent = UserLeftChatEvent;
//# sourceMappingURL=user-left-chat.event.js.map