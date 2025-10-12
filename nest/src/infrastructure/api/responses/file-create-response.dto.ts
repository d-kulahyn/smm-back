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
        description: 'File group information if file belongs to a group',
        type: FileGroupResponseDto
    })
    fileGroup?: FileGroupResponseDto;
}
