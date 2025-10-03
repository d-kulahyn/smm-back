import { Model } from 'mongoose';
import { ChatDocument } from '../database/schemas/chat.schema';
export declare class ChatService {
    private chatModel;
    constructor(chatModel: Model<ChatDocument>);
    findByProjectId(projectId: string): Promise<any[]>;
    findByProjectIds(projectIds: string[]): Promise<Map<string, any[]>>;
}
