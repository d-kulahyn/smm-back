import { ApiProperty } from '@nestjs/swagger';

export class ChunkInfoResponseDto {
    @ApiProperty({ example: 'clm1file123456' })
    fileId: string;

    @ApiProperty({ example: 10 })
    totalChunks?: number;

    @ApiProperty({ example: 5 })
    chunksUploaded: number;

    @ApiProperty({ example: [0, 1, 2, 3, 4], type: [Number] })
    uploadedChunkIndexes: number[];

    @ApiProperty({ example: false })
    isComplete: boolean;
}
