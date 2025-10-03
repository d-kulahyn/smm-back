import { Model } from 'mongoose';
import { ChatMemberRepository } from '../../domain/repositories/chat-member.repository';
import { ChatMember } from '../../domain/entities/chat-member.entity';
import { ChatMemberDocument } from '../database/schemas/chat-member.schema';
export declare class MongoChatMemberRepository implements ChatMemberRepository {
    private chatMemberModel;
    constructor(chatMemberModel: Model<ChatMemberDocument>);
    findById(id: string): Promise<ChatMember | null>;
    findByChatId(chatId: string): Promise<ChatMember[]>;
    findByUserId(userId: string): Promise<ChatMember[]>;
    findByChatAndUser(chatId: string, userId: string): Promise<ChatMember | null>;
    create(chatMember: ChatMember): Promise<ChatMember>;
    update(id: string, chatMemberData: Partial<ChatMember>): Promise<ChatMember>;
    delete(id: string): Promise<void>;
    isUserInChat(chatId: string, userId: string): Promise<boolean>;
    getChatAdmins(chatId: string): Promise<ChatMember[]>;
    private toDomain;
}
