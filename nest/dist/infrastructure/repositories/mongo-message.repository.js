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
exports.MongoMessageRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_entity_1 = require("../../domain/entities/message.entity");
const message_schema_1 = require("../database/schemas/message.schema");
let MongoMessageRepository = class MongoMessageRepository {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    async findById(id) {
        const message = await this.messageModel.findById(id).exec();
        return message ? this.toDomain(message) : null;
    }
    async findByChatId(chatId, page, limit) {
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            this.messageModel
                .find({ chatId, isDeleted: false })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.messageModel.countDocuments({ chatId, isDeleted: false })
        ]);
        return {
            data: messages.map(this.toDomain).reverse(),
            total,
            page,
            limit,
        };
    }
    async create(message) {
        const messageDoc = new this.messageModel({
            _id: message.id,
            chatId: message.chatId,
            senderId: message.senderId,
            content: message.content,
            type: message.type,
            fileUrl: message.fileUrl,
            readBy: message.readBy,
            isEdited: message.isEdited,
            editedAt: message.editedAt,
            isDeleted: message.isDeleted,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        });
        const created = await messageDoc.save();
        return this.toDomain(created);
    }
    async update(id, messageData) {
        const updated = await this.messageModel
            .findByIdAndUpdate(id, {
            ...messageData,
            updatedAt: new Date()
        }, { new: true })
            .exec();
        if (!updated) {
            throw new Error('Message not found');
        }
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.messageModel
            .findByIdAndUpdate(id, {
            isDeleted: true,
            updatedAt: new Date()
        })
            .exec();
    }
    async markAsRead(messageId, userId) {
        await this.messageModel
            .findByIdAndUpdate(messageId, {
            $addToSet: { readBy: userId },
            updatedAt: new Date()
        })
            .exec();
    }
    async markAllAsRead(chatId, userId) {
        await this.messageModel
            .updateMany({
            chatId,
            senderId: { $ne: userId },
            readBy: { $nin: [userId] },
            isDeleted: false
        }, {
            $addToSet: { readBy: userId },
            updatedAt: new Date()
        })
            .exec();
    }
    async markAllAsReadInChat(chatId, userId) {
        await this.messageModel
            .updateMany({
            chatId,
            senderId: { $ne: userId },
            readBy: { $nin: [userId] },
            isDeleted: false
        }, {
            $addToSet: { readBy: userId },
            updatedAt: new Date()
        })
            .exec();
    }
    async getUnreadCount(chatId, userId) {
        return this.messageModel
            .countDocuments({
            chatId,
            senderId: { $ne: userId },
            readBy: { $nin: [userId] },
            isDeleted: false
        })
            .exec();
    }
    async findUnreadMessages(userId) {
        const messages = await this.messageModel
            .find({
            senderId: { $ne: userId },
            readBy: { $nin: [userId] },
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .exec();
        return messages.map(this.toDomain);
    }
    async findByIdIn(ids) {
        const messages = await this.messageModel
            .find({ _id: { $in: ids }, isDeleted: false })
            .exec();
        return messages.map(this.toDomain);
    }
    async deleteManyByChatId(chatId) {
        await this.messageModel
            .updateMany({ chatId }, {
            isDeleted: true,
            updatedAt: new Date()
        })
            .exec();
    }
    toDomain(messageDoc) {
        return new message_entity_1.Message(messageDoc._id.toString(), messageDoc.chatId, messageDoc.senderId, messageDoc.content, messageDoc.type, messageDoc.createdAt, messageDoc.updatedAt, messageDoc.isRead || false, messageDoc.readAt, messageDoc.attachments || [], messageDoc.fileUrl, messageDoc.readBy || [], messageDoc.isEdited || false, messageDoc.editedAt, messageDoc.isDeleted || false);
    }
};
exports.MongoMessageRepository = MongoMessageRepository;
exports.MongoMessageRepository = MongoMessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoMessageRepository);
//# sourceMappingURL=mongo-message.repository.js.map