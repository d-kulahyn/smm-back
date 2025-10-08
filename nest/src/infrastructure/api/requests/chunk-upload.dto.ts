import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ChunkUploadDto {
    @ApiProperty({ description: 'Chunk index (0-based)', example: 0 })
    @IsNumber()
    chunkIndex: number;
}
