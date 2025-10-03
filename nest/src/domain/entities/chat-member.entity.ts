export enum ChatMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  MODERATOR = 'moderator'
}

export class ChatMember {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly userId: string,
    public readonly role: ChatMemberRole,
    public readonly joinedAt: Date = new Date(),
    public readonly isActive: boolean = true
  ) {}

  static create(params: {
    id: string;
    chatId: string;
    userId: string;
    role: ChatMemberRole;
  }): ChatMember {
    return new ChatMember(
      params.id,
      params.chatId,
      params.userId,
      params.role,
      new Date(),
      true
    );
  }

  deactivate(): ChatMember {
    return new ChatMember(
      this.id,
      this.chatId,
      this.userId,
      this.role,
      this.joinedAt,
      false
    );
  }
}
