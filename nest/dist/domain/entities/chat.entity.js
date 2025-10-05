"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor(id, name, createdBy, createdAt = new Date(), updatedAt = new Date(), isGroup = false, description, avatar, projectId, status, isActive = true, lastMessageAt) {
        this.id = id;
        this.name = name;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isGroup = isGroup;
        this.description = description;
        this.avatar = avatar;
        this.projectId = projectId;
        this.status = status;
        this.isActive = isActive;
        this.lastMessageAt = lastMessageAt;
    }
    get creatorId() {
        return this.createdBy;
    }
    static create(params) {
        return new Chat(params.id, params.name, params.createdBy, new Date(), new Date(), params.isGroup || false, params.description, params.avatar, params.projectId, params.status || 'active', true, undefined);
    }
}
exports.Chat = Chat;
//# sourceMappingURL=chat.entity.js.map