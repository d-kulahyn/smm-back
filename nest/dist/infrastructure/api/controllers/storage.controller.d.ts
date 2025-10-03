import { Response } from 'express';
export declare class StorageController {
    private readonly uploadPath;
    getAvatar(filename: string, res: Response): Promise<void>;
    getTaskAttachment(filename: string, res: Response): Promise<void>;
    private getMimeType;
}
