export declare enum ChatMemberRole {
    ADMIN = "admin",
    MEMBER = "member",
    MODERATOR = "moderator"
}
export declare class ChatMember {
    readonly id: string;
    readonly chatId: string;
    readonly userId: string;
    readonly role: ChatMemberRole;
    readonly joinedAt: Date;
    readonly isActive: boolean;
    constructor(id: string, chatId: string, userId: string, role: ChatMemberRole, joinedAt?: Date, isActive?: boolean);
    static create(params: {
        id: string;
        chatId: string;
        userId: string;
        role: ChatMemberRole;
    }): ChatMember;
    deactivate(): ChatMember;
}
