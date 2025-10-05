import { ChatMember } from '../../../domain/entities/chat-member.entity';
export declare class ChatMemberResource {
    id: string;
    chatId: string;
    userId: string;
    role: string;
    joinedAt: string;
    isActive: boolean;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    constructor(chatMember: ChatMember);
    static fromEntity(chatMember: ChatMember): ChatMemberResource;
    static collection(chatMembers: ChatMember[]): ChatMemberResource[];
    withUserInfo(user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    }): ChatMemberResource;
}
