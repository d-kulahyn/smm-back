"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatResource = void 0;
const date_formatter_1 = require("../../shared/formatters/date.formatter");
class ChatResource {
    constructor(chat) {
        this.id = chat.id;
        this.projectId = chat.projectId;
        this.customerId = chat.customerId;
        this.title = chat.title || chat.name;
        this.description = chat.description;
        this.status = chat.status;
        this.isActive = chat.isActive ?? true;
        this.isArchived = chat.isArchived ?? false;
        this.unreadMessagesCount = chat.unreadMessagesCount ?? 0;
        this.members = chat.members || [];
        this.lastMessageAt = chat.lastMessageAt ? date_formatter_1.DateFormatter.formatDateWithRelative(chat.lastMessageAt) : undefined;
        this.createdAt = date_formatter_1.DateFormatter.formatCreatedAt(chat.createdAt);
        this.updatedAt = date_formatter_1.DateFormatter.formatUpdatedAt(chat.updatedAt);
    }
    static fromEntity(chat) {
        return new ChatResource(chat);
    }
    static collection(chats) {
        return chats.map(chat => new ChatResource(chat));
    }
}
exports.ChatResource = ChatResource;
//# sourceMappingURL=chat-resource.dto.js.map