export declare class Chat {
    readonly id: string;
    readonly name: string;
    readonly createdBy: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly isGroup: boolean;
    readonly description?: string;
    readonly avatar?: string;
    readonly projectId?: string;
    readonly status?: string;
    readonly isActive: boolean;
    readonly lastMessageAt?: Date;
    constructor(id: string, name: string, createdBy: string, createdAt?: Date, updatedAt?: Date, isGroup?: boolean, description?: string, avatar?: string, projectId?: string, status?: string, isActive?: boolean, lastMessageAt?: Date);
    get creatorId(): string;
    static create(params: {
        id: string;
        name: string;
        description?: string;
        createdBy: string;
        isGroup?: boolean;
        avatar?: string;
        projectId?: string;
        status?: string;
    }): Chat;
}
