"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserJoinedChatEvent = void 0;
const base_event_1 = require("./base-event");
class UserJoinedChatEvent extends base_event_1.BaseEvent {
    constructor(chatMember, chatId, userId, addedBy, projectId) {
        super();
        this.chatMember = chatMember;
        this.chatId = chatId;
        this.userId = userId;
        this.addedBy = addedBy;
        this.projectId = projectId;
    }
    getEventName() {
        return 'chat.user.joined';
    }
    getPayload() {
        return {
            chatMember: {
                id: this.chatMember.id,
                chatId: this.chatMember.chatId,
                userId: this.chatMember.userId,
                role: this.chatMember.role,
                joinedAt: this.chatMember.joinedAt
            },
            chatId: this.chatId,
            userId: this.userId,
            addedBy: this.addedBy,
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
            `user.${this.addedBy}`
        ];
    }
    getBroadcastTransports() {
        return [
            base_event_1.BroadcastTransport.WEBSOCKET,
            base_event_1.BroadcastTransport.REDIS
        ];
    }
}
exports.UserJoinedChatEvent = UserJoinedChatEvent;
//# sourceMappingURL=user-joined-chat.event.js.map