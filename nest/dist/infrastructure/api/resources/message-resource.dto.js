"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResource = exports.MessageSenderResource = void 0;
class MessageSenderResource {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.avatar = user.avatar;
    }
    static fromEntity(user) {
        return new MessageSenderResource(user);
    }
}
exports.MessageSenderResource = MessageSenderResource;
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
        this.createdAt = message.createdAt?.toISOString();
        this.updatedAt = message.updatedAt?.toISOString();
    }
    static fromEntity(message) {
        return new MessageResource(message);
    }
    static collection(messages) {
        return messages.map(message => MessageResource.fromEntity(message));
    }
    withReadStatus(userId) {
        this.isReadByCurrentUser = this.readBy?.includes(userId);
        return this;
    }
    withSender(user) {
        this.sender = user ? MessageSenderResource.fromEntity(user) : undefined;
        return this;
    }
}
exports.MessageResource = MessageResource;
//# sourceMappingURL=message-resource.dto.js.map