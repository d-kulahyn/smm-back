import { ProjectResponseDto } from './project-response.dto';
export declare class ProjectListResponseDto {
    success: boolean;
    data: ProjectResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
