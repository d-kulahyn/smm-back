import { ApiProperty } from '@nestjs/swagger';

export class FileCompleteResponseDto {
    @ApiProperty({ example: 'clm1file123456' })
    fileId: string;

    @ApiProperty({ example: true })
    isComplete: boolean;

    @ApiProperty({ example: '/storage/chunked/1696420398754-abc123-document.pdf' })
    downloadUrl: string;

    @ApiProperty({ example: 'File upload completed successfully' })
    message: string;
}
