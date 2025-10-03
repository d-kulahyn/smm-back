"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMemberResource = void 0;
class ChatMemberResource {
    constructor(chatMember) {
        this.id = chatMember.id;
        this.chatId = chatMember.chatId;
        this.userId = chatMember.userId;
        this.role = chatMember.role;
        this.joinedAt = chatMember.joinedAt.toISOString();
        this.isActive = chatMember.isActive;
    }
    static fromEntity(chatMember) {
        return new ChatMemberResource(chatMember);
    }
    static collection(chatMembers) {
        return chatMembers.map(member => ChatMemberResource.fromEntity(member));
    }
    withUserInfo(user) {
        this.user = user;
        return this;
    }
}
exports.ChatMemberResource = ChatMemberResource;
//# sourceMappingURL=chat-member-resource.dto.js.map