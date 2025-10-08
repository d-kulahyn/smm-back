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
exports.MongoChatRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_entity_1 = require("../../domain/entities/chat.entity");
let MongoChatRepository = class MongoChatRepository {
    constructor(chatModel, messageRepository, chatMemberRepository) {
        this.chatModel = chatModel;
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
    }
    async findById(id) {
        const chat = await this.chatModel.findById(id).exec();
        return chat ? this.toDomain(chat) : null;
    }
    async findByIdWithExtras(id) {
        const chat = await this.chatModel.findById(id).exec();
        return chat ? (await this.getExtraForChat([chat], '')[0]) : null;
    }
    async findByProjectId(projectId, userId) {
        const chats = await this.chatModel.find({ projectId }).exec();
        return await this.getExtraForChat(chats, userId);
    }
    async findByProjectIds(projectIds) {
        const chats = await this.chatModel.find({
            projectId: { $in: projectIds }
        }).exec();
        const chatsMap = new Map();
        projectIds.forEach(id => chatsMap.set(id, []));
        chats.forEach(chatDoc => {
            const chat = this.toDomain(chatDoc);
            const projectId = chat.projectId;
            const existingChats = chatsMap.get(projectId) || [];
            existingChats.push(chat);
            chatsMap.set(projectId, existingChats);
        });
        return chatsMap;
    }
    async findByProjectIdPaginated(projectId, page, limit) {
        const skip = (page - 1) * limit;
        const [chats, total] = await Promise.all([
            this.chatModel
                .find({ projectId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.chatModel.countDocuments({ projectId })
        ]);
        return {
            data: chats.map(this.toDomain),
            total,
            page,
            limit,
        };
    }
    async findByUserId(userId) {
        const chats = await this.chatModel.find({
            $or: [
                { creatorId: userId },
                { members: userId }
            ]
        }).exec();
        return chats.map(this.toDomain);
    }
    async findUserChats(userId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = {
            $or: [
                { creatorId: userId },
                { members: userId }
            ]
        };
        const [chats, total] = await Promise.all([
            this.chatModel
                .find(filter)
                .sort({ lastMessageAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.chatModel.countDocuments(filter)
        ]);
        return {
            data: chats.map(this.toDomain),
            total,
            page,
            limit,
        };
    }
    async create(chat) {
        const chatDoc = new this.chatModel({
            _id: chat.id,
            projectId: chat.projectId,
            name: chat.name,
            creatorId: chat.creatorId,
            description: chat.description,
            status: chat.status,
            isActive: chat.isActive,
            isGroup: chat.isGroup,
            avatar: chat.avatar,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        });
        const created = await chatDoc.save();
        return this.toDomain(created);
    }
    async update(id, chatData) {
        const updated = await this.chatModel
            .findByIdAndUpdate(id, {
            ...chatData,
            updatedAt: new Date()
        }, { new: true })
            .exec();
        if (!updated) {
            throw new Error('Chat not found');
        }
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.chatModel.findByIdAndDelete(id).exec();
    }
    async findByProjectIdPaginatedWithExtras(projectId, userId, page, limit) {
        const skip = (page - 1) * limit;
        const [chats, total] = await Promise.all([
            this.chatModel
                .find({ projectId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.chatModel.countDocuments({ projectId })
        ]);
        const chatsWithExtras = await this.getExtraForChat(chats, userId);
        return {
            data: chatsWithExtras,
            total,
            page,
            limit,
        };
    }
    async getExtraForChat(chats, userId) {
        return await Promise.all(chats.map(async (chatDoc) => {
            const chat = this.toDomain(chatDoc);
            const [unreadCount, lastMessage, chatMembers] = await Promise.all([
                this.messageRepository.countUnreadMessages(chat.id, userId),
                this.messageRepository.findLastMessageByChatId(chat.id),
                this.chatMemberRepository.findByChatIdWithUsers(chat.id)
            ]);
            return {
                ...chat,
                unreadCount,
                lastMessage,
                chatMembers
            };
        }));
    }
    async findByProjectIdsWithExtras(projectIds, userId) {
        const chats = await this.chatModel.find({
            projectId: { $in: projectIds }
        }).exec();
        const chatsMap = new Map();
        projectIds.forEach(id => chatsMap.set(id, []));
        const chatsWithExtras = await Promise.all(chats.map(async (chatDoc) => {
            const chat = this.toDomain(chatDoc);
            const [unreadCount, lastMessage, chatMembers] = await Promise.all([
                this.messageRepository.countUnreadMessages(chat.id, userId),
                this.messageRepository.findLastMessageByChatId(chat.id),
                this.chatMemberRepository.findByChatIdWithUsers(chat.id)
            ]);
            return {
                ...chat,
                unreadCount,
                lastMessage,
                chatMembers
            };
        }));
        chatsWithExtras.forEach(chatWithExtras => {
            const projectId = chatWithExtras.projectId;
            const existingChats = chatsMap.get(projectId) || [];
            existingChats.push(chatWithExtras);
            chatsMap.set(projectId, existingChats);
        });
        return chatsMap;
    }
    toDomain(chatDoc) {
        return new chat_entity_1.Chat(chatDoc._id.toString(), chatDoc.name, chatDoc.createdBy || chatDoc.creatorId, chatDoc.createdAt, chatDoc.updatedAt, chatDoc.isGroup || false, chatDoc.description, chatDoc.avatar, chatDoc.projectId, chatDoc.status, chatDoc.isActive !== undefined ? chatDoc.isActive : true, chatDoc.lastMessageAt);
    }
};
exports.MongoChatRepository = MongoChatRepository;
exports.MongoChatRepository = MongoChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_entity_1.Chat.name)),
    __param(1, (0, common_1.Inject)('MESSAGE_REPOSITORY')),
    __param(2, (0, common_1.Inject)('CHAT_MEMBER_REPOSITORY')),
    __metadata("design:paramtypes", [mongoose_2.Model, Object, Object])
], MongoChatRepository);
//# sourceMappingURL=mongo-chat.repository.js.map