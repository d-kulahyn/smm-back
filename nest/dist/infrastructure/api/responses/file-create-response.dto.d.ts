export declare class FileCreateResponseDto {
    fileId: string;
    filename: string;
    uploadUrl: string;
    isComplete: boolean;
    chunksUploaded: number;
    totalChunks?: number;
}
