import { ApiProperty } from '@nestjs/swagger';

export class FileCreateResponseDto {
    @ApiProperty({ example: 'clm1file123456' })
    fileId: string;

    @ApiProperty({ example: 'document.pdf' })
    filename: string;

    @ApiProperty({ example: '/storage/chunked/1696420398754-abc123-document.pdf' })
    uploadUrl: string;

    @ApiProperty({ example: false })
    isComplete: boolean;

    @ApiProperty({ example: 0 })
    chunksUploaded: number;

    @ApiProperty({ example: 10 })
    totalChunks?: number;
}
