import { ApiProperty } from '@nestjs/swagger';
import { FileResource } from '../resources/file-resource.dto';

export class EntityFilesResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: [FileResource] })
    data: FileResource[];

    @ApiProperty({ example: 5 })
    total: number;
}
