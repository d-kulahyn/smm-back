import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileGroupResponseDto } from './file-group-response.dto';

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

    @ApiPropertyOptional({
        example: 'clm1thumb123456',
        description: 'ID of thumbnail file (for images)'
    })
    thumbnailId?: string;

    @ApiPropertyOptional({
        description: 'Thumbnail file information (for images)',
        type: () => FileCreateResponseDto,
        example: {
            fileId: 'clm1thumb123456',
            filename: 'thumb_image.jpg',
            uploadUrl: '/storage/chunked/thumb_image.jpg',
            isComplete: true,
            chunksUploaded: 1,
            totalChunks: 1
        }
    })
    thumbnail?: FileCreateResponseDto;

    @ApiPropertyOptional({
        description: 'File group information if file belongs to a group',
        type: FileGroupResponseDto
    })
    fileGroup?: FileGroupResponseDto;
}
