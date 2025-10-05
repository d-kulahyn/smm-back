"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("../database/schemas/chat.schema");
let ChatService = class ChatService {
    constructor(chatModel) {
        this.chatModel = chatModel;
    }
    async findByProjectId(projectId) {
        const chats = await this.chatModel.find({ projectId }).exec();
        return chats.map(chat => ({
            id: chat._id.toString(),
            name: chat.name,
            description: chat.description,
            members: chat.members,
            isActive: chat.isActive,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        }));
    }
    async findByProjectIds(projectIds) {
        const chats = await this.chatModel.find({
            projectId: { $in: projectIds }
        }).exec();
        const chatsMap = new Map();
        projectIds.forEach(id => chatsMap.set(id, []));
        chats.forEach(chat => {
            const projectId = chat.projectId;
            const existingChats = chatsMap.get(projectId) || [];
            existingChats.push({
                id: chat._id.toString(),
                name: chat.name,
                description: chat.description,
                members: chat.members,
                isActive: chat.isActive,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            });
            chatsMap.set(projectId, existingChats);
        });
        return chatsMap;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map