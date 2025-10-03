import {ChatMember} from '../../../domain/entities/chat-member.entity';

export class ChatMemberResource {
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

    constructor(chatMember: ChatMember) {
        this.id = chatMember.id;
        this.chatId = chatMember.chatId;
        this.userId = chatMember.userId;
        this.role = chatMember.role;
        this.joinedAt = chatMember.joinedAt.toISOString();
        this.isActive = chatMember.isActive;
    }

    static fromEntity(chatMember: ChatMember): ChatMemberResource {
        return new ChatMemberResource(chatMember);
    }

    static collection(chatMembers: ChatMember[]): ChatMemberResource[] {
        return chatMembers.map(member => ChatMemberResource.fromEntity(member));
    }

    withUserInfo(user: { id: string; name: string; email: string; avatar?: string }): ChatMemberResource {
        this.user = user;
        return this;
    }
}
