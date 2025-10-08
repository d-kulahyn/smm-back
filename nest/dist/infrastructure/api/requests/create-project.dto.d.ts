import { ProjectStatus } from '../../../../domain/enums/index';
export declare class CreateProjectDto {
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    endDate?: string;
    budget?: number;
    color?: string;
    avatar?: any;
}
