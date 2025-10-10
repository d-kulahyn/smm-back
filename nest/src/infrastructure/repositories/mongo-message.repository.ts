import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {MessageRepository} from '../../domain/repositories/message.repository';
import {Message} from '../../domain/entities/message.entity';
import {MessageType} from '../../domain/enums/message-type.enum';
import {Message as MessageSchema, MessageDocument} from '../database/schemas/message.schema';
import {MessageRead as MessageReadSchema, MessageReadDocument} from '../database/schemas/message-read.schema';

@Injectable()
export class MongoMessageRepository implements MessageRepository {
    constructor(
        @InjectModel(MessageSchema.name) private messageModel: Model<MessageDocument>,
        @InjectModel(MessageReadSchema.name) private messageReadModel: Model<MessageReadDocument>,
    ) {
    }

    async findById(id: string): Promise<Message | null> {
        const message = await this.messageModel.findById(id).exec();
        if (!message) return null;

        const readBy = await this.getReadByUsers([id]);
        return this.toDomain(message, readBy[id] || []);
    }

    async findByChatId(chatId: string, userId?: string, createdAt?: string, sort?: 'asc' | 'desc', per_page: number = 10): Promise<{
        data: Message[];
        total: number;
    }> {
        let filter: any = {chatId};
        let sortCriteria: any = {createdAt: -1};

        const limit = Math.max(1, Math.min(100, Number(per_page) || 10));

        if (createdAt && sort) {
            if (sort === 'asc') {
                filter.createdAt = {$gt: new Date(createdAt)};
            } else if (sort === 'desc') {
                filter.createdAt = {$lt: new Date(createdAt)};
            }

            const [messages, total] = await Promise.all([
                this.messageModel
                    .find(filter)
                    .limit(limit)
                    .sort(sortCriteria)
                    .exec(),
                this.messageModel.countDocuments({chatId})
            ]);

            const messageIds = messages.map(msg => msg._id.toString());
            const readByData = await this.getReadByUsers(messageIds);

            return {
                data: messages.map(msg => this.toDomain(msg, readByData[msg._id.toString()] || [])),
                total,
            };
        } else if (!createdAt && !sort && userId) {
            const lastReadMessage = await this.messageReadModel.findOne({userId, chatId}).sort({messageCreatedAt: -1}).exec();
            const filter: any =  {};
            let messages: any;

            if (lastReadMessage) {
                const lastMessage = await this.messageModel.findOne({_id: lastReadMessage.messageId}).exec();
                filter.createdAt = {$gt: new Date(lastMessage.createdAt)};
                messages = await this.messageModel.find({chatId, ...filter}).limit(limit).sort({createdAt: 1}).exec();

                if(messages.length < limit){
                    const newMessagesFilter = {createdAt: {$lte: new Date(lastMessage.createdAt)},}

                    const newMessages = await this.messageModel.find({chatId: chatId, ...newMessagesFilter}).limit(limit - messages.length).sort({createdAt: -1}).exec();
                    messages = [...newMessages.reverse(), ...messages]
                }
            } else {
                const anyMyMsg = await this.messageModel.findOne({chatId: chatId, senderId: userId}).exec();
                const newMessages = await this.messageModel.find({chatId: chatId}).limit(limit).sort({createdAt: anyMyMsg ? -1 : 1}).exec();
                messages = anyMyMsg ? newMessages.reverse() : newMessages
            }

            const total = await this.messageModel.countDocuments({chatId});

            const messageIds = messages.map(msg => msg._id.toString());
            const readByData = await this.getReadByUsers(messageIds);

            return {
                data: messages.map(msg => this.toDomain(msg, readByData[msg._id.toString()] || [])),
                total,
            };
        }

        const [messages, total] = await Promise.all([
            this.messageModel
                .find(filter)
                .limit(limit)
                .sort(sortCriteria)
                .exec(),
            this.messageModel.countDocuments({chatId})
        ]);

        const messageIds = messages.map(msg => msg._id.toString());
        const readByData = await this.getReadByUsers(messageIds);

        return {
            data: messages.map(msg => this.toDomain(msg, readByData[msg._id.toString()] || [])),
            total,
        };
    }

    async create(message: Message): Promise<Message> {
        const createdMessage = new this.messageModel(this.toDocument(message));
        const savedMessage = await createdMessage.save();
        const readBy = await this.getReadByUsers([savedMessage._id.toString()]);
        return this.toDomain(savedMessage, readBy[savedMessage._id.toString()] || []);
    }

    async update(id: string, updates: Partial<Message>): Promise<Message> {
        const updatedMessage = await this.messageModel
            .findByIdAndUpdate(id, updates, {new: true})
            .exec();
        const readBy = await this.getReadByUsers([id]);
        return this.toDomain(updatedMessage, readBy[id] || []);
    }

    async delete(id: string): Promise<void> {
        await this.messageModel.findByIdAndDelete(id).exec();
    }

    async markAsRead(messageId: string, userId: string, chatId: string): Promise<void> {
        try {
            const message = await this.messageModel.findOne({_id: messageId}).exec();
            await this.messageReadModel.findOneAndUpdate(
                {messageId, userId, chatId},
                {
                    $set: {
                        readAt: new Date()
                    },
                    $setOnInsert: {
                        messageId,
                        userId,
                        chatId,
                        messageCreatedAt: message.createdAt
                    }
                },
                {upsert: true}
            ).exec();
        } catch (error) {
            if (error.code !== 11000) {
                throw error;
            }
        }
    }

    async markAllAsRead(chatId: string, userId: string): Promise<void> {
        const lastRead = await this.messageReadModel.findOne({userId, chatId}).sort({messageCreatedAt: -1}).exec();
        const filter: any = {chatId};
        if (lastRead) {
            filter.createdAt = {$gt: new Date(lastRead.messageCreatedAt)};
        }
        const mongoMessages = await this.messageModel.find(filter).exec();

        if (mongoMessages.length > 0) {
            // Конвертируем mongoose документы в доменные объекты
            const messageIds = mongoMessages.map(msg => msg._id.toString());
            const readByData = await this.getReadByUsers(messageIds);
            const domainMessages = mongoMessages.map(msg => this.toDomain(msg, readByData[msg._id.toString()] || []));

            await this.markMultipleAsRead(domainMessages, userId, chatId);
        }
    }

    async markMultipleAsRead(messages: Message[], userId: string, chatId: string): Promise<void> {
        const operations = messages.map(message => ({
            updateOne: {
                filter: {messageId: message.id, userId, chatId},
                update: {
                    $set: {
                        readAt: new Date()
                    },
                    $setOnInsert: {
                        messageId: message.id,
                        userId,
                        chatId,
                        messageCreatedAt: message.createdAt
                    }
                },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            try {
                await this.messageReadModel.bulkWrite(operations, { ordered: false });
            } catch (error) {
                // Если это MongoBulkWriteError с дублированными ключами, проверяем детали
                if (error.name === 'MongoBulkWriteError') {
                    // Проверяем, есть ли ошибки отличные от дублирования ключей
                    const nonDuplicateErrors = error.writeErrors?.filter(err => err.code !== 11000) || [];
                    if (nonDuplicateErrors.length > 0) {
                        throw error; // Есть другие ошибки, пробрасываем их
                    }
                    // Все ошибки связаны с дублированием ключей - игнорируем
                } else {
                    throw error; // Другой тип ошибки - пробрасываем
                }
            }
        }
    }

    async findUnreadMessages(userId: string): Promise<Message[]> {
        const readMessageIds = await this.messageReadModel
            .find({userId})
            .select('messageId')
            .exec();

        const readIds = readMessageIds.map(read => read.messageId);

        const messages = await this.messageModel
            .find({
                senderId: {$ne: userId},
                _id: {$nin: readIds}
            })
            .exec();

        const messageIds = messages.map(msg => msg._id.toString());
        const readByData = await this.getReadByUsers(messageIds);

        return messages.map(msg => this.toDomain(msg, readByData[msg._id.toString()] || []));
    }

    async countUnreadMessages(chatId: string, userId: string): Promise<number> {
        const readMessageIds = await this.messageReadModel
            .find({userId})
            .select('messageId')
            .exec();

        const readIds = readMessageIds.map(read => read.messageId);

        return this.messageModel.countDocuments({
            chatId,
            senderId: {$ne: userId},
            _id: {$nin: readIds}
        });
    }

    async findByIdIn(ids: string[]): Promise<Message[]> {
        const messages = await this.messageModel.find({_id: {$in: ids}}).exec();
        const readByData = await this.getReadByUsers(ids);

        return messages.map(msg => this.toDomain(msg, readByData[msg._id.toString()] || []));
    }

    async deleteManyByChatId(chatId: string): Promise<void> {
        await this.messageModel.deleteMany({chatId}).exec();
    }

    async findLastMessageByChatId(chatId: string): Promise<Message | null> {
        const message = await this.messageModel
            .findOne({chatId})
            .sort({createdAt: -1})
            .exec();

        if (!message) return null;

        const readBy = await this.getReadByUsers([message._id.toString()]);
        return this.toDomain(message, readBy[message._id.toString()] || []);
    }

    private async getReadByUsers(messageIds: string[]): Promise<{[messageId: string]: string[]}> {
        const readRecords = await this.messageReadModel
            .find({messageId: {$in: messageIds}})
            .select('messageId userId')
            .exec();

        const readByMap: {[messageId: string]: string[]} = {};

        readRecords.forEach(record => {
            if (!readByMap[record.messageId]) {
                readByMap[record.messageId] = [];
            }
            readByMap[record.messageId].push(record.userId);
        });

        return readByMap;
    }

    private toDomain(doc: any, readBy: string[] = []): Message {
        return new Message(
            doc._id.toString(),
            doc.chatId,
            doc.senderId,
            doc.content,
            doc.type || MessageType.TEXT,
            doc.createdAt,
            doc.updatedAt,
            null,
            readBy,
        );
    }

    private toDocument(message: Message): any {
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
}
