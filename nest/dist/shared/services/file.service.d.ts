export declare class FileService {
    private readonly uploadPath;
    private readonly avatarsPath;
    private readonly messagesPath;
    constructor();
    private ensureDirectoriesExist;
    saveAvatar(file: Express.Multer.File): Promise<string>;
    deleteAvatar(avatarPath: string): Promise<void>;
    saveMessageFile(file: Express.Multer.File): Promise<{
        filePath: string;
        originalName: string;
    }>;
    deleteMessageFile(filePath: string): Promise<void>;
    private getFileExtension;
    getAvatarUrl(avatarPath: string): string;
}
