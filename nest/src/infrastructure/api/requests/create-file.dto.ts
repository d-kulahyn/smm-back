import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

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

    @ApiPropertyOptional({
        description: 'File group ID to assign file to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsOptional()
    @IsUUID()
    fileGroupId?: string;

    @ApiPropertyOptional({ description: "Relative upload path inside 'uploads' (e.g. 'projects/123')", example: 'projects/123' })
    @IsOptional()
    @IsString()
    uploadPath?: string;
}
