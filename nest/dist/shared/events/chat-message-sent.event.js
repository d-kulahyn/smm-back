"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageSentEvent = void 0;
const base_event_1 = require("./base-event");
class ChatMessageSentEvent extends base_event_1.BaseEvent {
    constructor(message, chatId, senderId, projectId, chatMembers) {
        super();
        this.message = message;
        this.chatId = chatId;
        this.senderId = senderId;
        this.projectId = projectId;
        this.chatMembers = chatMembers;
    }
    getEventName() {
        return 'chat.message.sent';
    }
    getPayload() {
        return {
            message: {
                id: this.message.id,
                chatId: this.message.chatId,
                senderId: this.message.senderId,
                content: this.message.content,
                type: this.message.type,
                fileUrl: this.message.fileUrl,
                createdAt: this.message.createdAt,
                isEdited: this.message.isEdited,
                readBy: this.message.readBy
            },
            chatId: this.chatId,
            senderId: this.senderId,
            projectId: this.projectId,
            chatMembers: this.chatMembers,
            timestamp: this.timestamp,
            eventId: this.eventId
        };
    }
    getBroadcastChannels() {
        const memberChannels = this.chatMembers.map(userId => `socket.chats.${this.chatId}.${userId}`);
        return [...memberChannels];
    }
    getBroadcastTransports() {
        return [
            base_event_1.BroadcastTransport.REDIS
        ];
    }
}
exports.ChatMessageSentEvent = ChatMessageSentEvent;
//# sourceMappingURL=chat-message-sent.event.js.map