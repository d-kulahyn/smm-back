import { ApiProperty } from '@nestjs/swagger';

export class ChunkUploadResponseDto {
    @ApiProperty({ example: 'clm1file123456' })
    fileId: string;

    @ApiProperty({ example: 5 })
    chunksUploaded: number;

    @ApiProperty({ example: false })
    isComplete: boolean;

    @ApiProperty({ example: 'Chunk uploaded successfully' })
    message: string;

    @ApiProperty({ example: 0 })
    chunkIndex: number;
}
