"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatResource = void 0;
class ChatResource {
    constructor(chat) {
        this.id = chat.id;
        this.projectId = chat.projectId;
        this.name = chat.name;
        this.description = chat.description;
        this.status = chat.status;
        this.isActive = chat.isActive;
        this.creatorId = chat.creatorId;
        this.lastMessageAt = chat.lastMessageAt?.toISOString();
        this.createdAt = chat.createdAt.toISOString();
        this.updatedAt = chat.updatedAt.toISOString();
    }
    static fromEntity(chat) {
        return new ChatResource(chat);
    }
    static collection(chats) {
        return chats.map(chat => ChatResource.fromEntity(chat));
    }
    withMembersCount(count) {
        this.membersCount = count;
        return this;
    }
    withUnreadCount(count) {
        this.unreadCount = count;
        return this;
    }
}
exports.ChatResource = ChatResource;
//# sourceMappingURL=chat-resource.dto.js.map