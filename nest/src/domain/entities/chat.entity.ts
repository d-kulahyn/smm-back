export class Chat {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdBy: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly isGroup: boolean = false,
    public readonly description?: string,
    public readonly avatar?: string,
    public readonly projectId?: string,
    public readonly status?: string,
    public readonly isActive: boolean = true,
    public readonly lastMessageAt?: Date
  ) {}

  // Add getter for creatorId (alias for createdBy)
  get creatorId(): string {
    return this.createdBy;
  }

  static create(params: {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    isGroup?: boolean;
    avatar?: string;
    projectId?: string;
    status?: string;
  }): Chat {
    return new Chat(
      params.id,
      params.name,
      params.createdBy,
      new Date(),
      new Date(),
      params.isGroup || false,
      params.description,
      params.avatar,
      params.projectId,
      params.status || 'active',
      true,
      undefined
    );
  }
}
