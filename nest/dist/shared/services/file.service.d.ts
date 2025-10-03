export declare class FileService {
    private readonly uploadPath;
    private readonly avatarsPath;
    private readonly tasksPath;
    constructor();
    private ensureDirectoriesExist;
    saveAvatar(file: Express.Multer.File): Promise<string>;
    deleteAvatar(avatarPath: string): Promise<void>;
    saveTaskAttachment(file: Express.Multer.File): Promise<{
        filePath: string;
        originalName: string;
    }>;
    deleteTaskAttachment(filePath: string): Promise<void>;
    private getFileExtension;
    getAvatarUrl(avatarPath: string): string;
}
