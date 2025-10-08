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
const message_type_enum_1 = require("../../domain/enums/message-type.enum");
const message_schema_1 = require("../database/schemas/message.schema");
const message_read_schema_1 = require("../database/schemas/message-read.schema");
let MongoMessageRepository = class MongoMessageRepository {
    constructor(messageModel, messageReadModel) {
        this.messageModel = messageModel;
        this.messageReadModel = messageReadModel;
    }
    async findById(id) {
        const message = await this.messageModel.findById(id).exec();
        return message ? this.toDomain(message) : null;
    }
    async findByChatId(chatId, createdAt, sort, per_page = 10) {
        const filter = { chatId };
        if (createdAt && sort) {
            if (sort === 'asc') {
                filter.createdAt = { $gt: new Date(createdAt) };
            }
            else if (sort === 'desc') {
                filter.createdAt = { $lt: new Date(createdAt) };
            }
        }
        const [messages, total] = await Promise.all([
            this.messageModel
                .find(filter)
                .limit(per_page)
                .sort({ createdAt: -1 })
                .exec(),
            this.messageModel.countDocuments({ chatId })
        ]);
        return {
            data: messages.map(this.toDomain),
            total,
        };
    }
    async create(message) {
        const createdMessage = new this.messageModel(this.toDocument(message));
        const savedMessage = await createdMessage.save();
        return this.toDomain(savedMessage);
    }
    async update(id, updates) {
        const updatedMessage = await this.messageModel
            .findByIdAndUpdate(id, updates, { new: true })
            .exec();
        return this.toDomain(updatedMessage);
    }
    async delete(id) {
        await this.messageModel.findByIdAndDelete(id).exec();
    }
    async markAsRead(messageId, userId) {
        await this.messageReadModel.findOneAndUpdate({ messageId, userId }, { messageId, userId, readAt: new Date() }, { upsert: true }).exec();
    }
    async markAllAsRead(chatId, userId) {
        const messages = await this.messageModel.find({ chatId }).select('_id').exec();
        const messageIds = messages.map(msg => msg._id.toString());
        if (messageIds.length > 0) {
            await this.markMultipleAsRead(messageIds, userId);
        }
    }
    async markMultipleAsRead(messageIds, userId) {
        const operations = messageIds.map(messageId => ({
            updateOne: {
                filter: { messageId, userId },
                update: { messageId, userId, readAt: new Date() },
                upsert: true
            }
        }));
        if (operations.length > 0) {
            await this.messageReadModel.bulkWrite(operations);
        }
    }
    async findUnreadMessages(userId) {
        const readMessageIds = await this.messageReadModel
            .find({ userId })
            .select('messageId')
            .exec();
        const readIds = readMessageIds.map(read => read.messageId);
        const messages = await this.messageModel
            .find({
            senderId: { $ne: userId },
            _id: { $nin: readIds }
        })
            .exec();
        return messages.map(this.toDomain);
    }
    async countUnreadMessages(chatId, userId) {
        const readMessageIds = await this.messageReadModel
            .find({ userId })
            .select('messageId')
            .exec();
        const readIds = readMessageIds.map(read => read.messageId);
        return this.messageModel.countDocuments({
            chatId,
            senderId: { $ne: userId },
            _id: { $nin: readIds }
        });
    }
    async findByIdIn(ids) {
        const messages = await this.messageModel.find({ _id: { $in: ids } }).exec();
        return messages.map(this.toDomain);
    }
    async deleteManyByChatId(chatId) {
        await this.messageModel.deleteMany({ chatId }).exec();
    }
    async findLastMessageByChatId(chatId) {
        const message = await this.messageModel
            .findOne({ chatId })
            .sort({ createdAt: -1 })
            .exec();
        return message ? this.toDomain(message) : null;
    }
    toDomain(doc) {
        return new message_entity_1.Message(doc._id.toString(), doc.chatId, doc.senderId, doc.content, doc.type || message_type_enum_1.MessageType.TEXT, doc.fileUrl || null, doc.createdAt, doc.updatedAt, doc.readBy || []);
    }
    toDocument(message) {
        return {
            _id: message.id,
            chatId: message.chatId,
            senderId: message.senderId,
            content: message.content,
            type: message.type,
            fileUrl: message.fileUrl,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        };
    }
};
exports.MongoMessageRepository = MongoMessageRepository;
exports.MongoMessageRepository = MongoMessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_read_schema_1.MessageRead.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MongoMessageRepository);
//# sourceMappingURL=mongo-message.repository.js.map