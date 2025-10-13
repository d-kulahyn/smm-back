import { ApiProperty } from '@nestjs/swagger';

export class ChunkUploadResponseDto {
    @ApiProperty({ example: 'clm1file123456' })
    fileId: string;

    @ApiProperty({ example: 5 })
    chunksUploaded: number;

    @ApiProperty({ example: false })
    isComplete: boolean;
}
