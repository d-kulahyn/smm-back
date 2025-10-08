import { ApiProperty } from '@nestjs/swagger';
import { FileCreateResponseDto } from './file-create-response.dto';

export class EntityFilesResponseDto {
    @ApiProperty({ type: [FileCreateResponseDto] })
    files: FileCreateResponseDto[];

    @ApiProperty({ example: 5 })
    total: number;
}
