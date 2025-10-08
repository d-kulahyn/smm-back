import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateFileDto {
    @ApiProperty({ description: 'Original filename', example: 'document.pdf' })
    @IsString()
    originalName: string;

    @ApiProperty({ description: 'MIME type', example: 'application/pdf' })
    @IsString()
    mimeType: string;

    @ApiProperty({ description: 'File size in bytes', example: 1024000 })
    @IsNumber()
    size: number;

    @ApiProperty({ description: 'Entity type to attach file to', example: 'project' })
    @IsString()
    entityType: string;

    @ApiProperty({ description: 'Entity ID to attach file to', example: 'clm1project123456' })
    @IsUUID()
    entityId: string;

    @ApiProperty({ description: 'Total number of chunks (required for parallel uploads)', example: 10 })
    @IsNumber()
    totalChunks: number;
}
