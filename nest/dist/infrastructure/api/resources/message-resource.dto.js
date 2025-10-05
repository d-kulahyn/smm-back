"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResource = void 0;
class MessageResource {
    constructor(message) {
        this.id = message.id;
        this.chatId = message.chatId;
        this.senderId = message.senderId;
        this.content = message.content;
        this.type = message.type;
        this.fileUrl = message.fileUrl;
        this.readBy = message.readBy;
        this.isEdited = message.isEdited;
        this.editedAt = message.editedAt?.toISOString();
        this.isDeleted = message.isDeleted;
        this.createdAt = message.createdAt.toISOString();
        this.updatedAt = message.updatedAt.toISOString();
    }
    static fromEntity(message) {
        return new MessageResource(message);
    }
    static collection(messages) {
        return messages.map(message => MessageResource.fromEntity(message));
    }
    withReadStatus(userId) {
        this.isReadByCurrentUser = this.readBy.includes(userId);
        return this;
    }
}
exports.MessageResource = MessageResource;
//# sourceMappingURL=message-resource.dto.js.map