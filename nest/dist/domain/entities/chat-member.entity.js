"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMember = exports.ChatMemberRole = void 0;
var ChatMemberRole;
(function (ChatMemberRole) {
    ChatMemberRole["ADMIN"] = "admin";
    ChatMemberRole["MEMBER"] = "member";
    ChatMemberRole["MODERATOR"] = "moderator";
})(ChatMemberRole || (exports.ChatMemberRole = ChatMemberRole = {}));
class ChatMember {
    constructor(id, chatId, userId, role, joinedAt = new Date(), isActive = true) {
        this.id = id;
        this.chatId = chatId;
        this.userId = userId;
        this.role = role;
        this.joinedAt = joinedAt;
        this.isActive = isActive;
    }
    static create(params) {
        return new ChatMember(params.id, params.chatId, params.userId, params.role, new Date(), true);
    }
    deactivate() {
        return new ChatMember(this.id, this.chatId, this.userId, this.role, this.joinedAt, false);
    }
}
exports.ChatMember = ChatMember;
//# sourceMappingURL=chat-member.entity.js.map