"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(id, chatId, senderId, content, type, createdAt = new Date(), updatedAt = new Date(), isRead = false, readAt, attachments, fileUrl, readBy, isEdited = false, editedAt, isDeleted = false) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isRead = isRead;
        this.readAt = readAt;
        this.attachments = attachments;
        this.fileUrl = fileUrl;
        this.readBy = readBy;
        this.isEdited = isEdited;
        this.editedAt = editedAt;
        this.isDeleted = isDeleted;
    }
    static create(params) {
        return new Message(params.id, params.chatId, params.senderId, params.content, params.type, new Date(), new Date(), false, undefined, params.attachments, params.fileUrl, [], false, undefined, false);
    }
    markAsRead() {
        return new Message(this.id, this.chatId, this.senderId, this.content, this.type, this.createdAt, new Date(), true, new Date(), this.attachments, this.fileUrl, this.readBy, this.isEdited, this.editedAt, this.isDeleted);
    }
}
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map