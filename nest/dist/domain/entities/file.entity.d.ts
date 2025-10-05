export declare class FileEntity {
    readonly id: string;
    readonly filename: string;
    readonly originalName: string;
    readonly mimeType: string;
    readonly size: number;
    readonly uploadPath: string;
    readonly entityType: string;
    readonly entityId: string;
    readonly uploadedBy: string;
    readonly isComplete: boolean;
    readonly chunks: number;
    readonly totalChunks?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, filename: string, originalName: string, mimeType: string, size: number, uploadPath: string, entityType: string, entityId: string, uploadedBy: string, isComplete?: boolean, chunks?: number, totalChunks?: number, createdAt?: Date, updatedAt?: Date);
    static create(params: {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadPath: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        totalChunks?: number;
    }): FileEntity;
    markChunkUploaded(): FileEntity;
    markComplete(): FileEntity;
    toPlainObject(): {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadPath: string;
        entityType: string;
        entityId: string;
        uploadedBy: string;
        isComplete: boolean;
        chunks: number;
        totalChunks: number;
        createdAt: Date;
        updatedAt: Date;
    };
}
