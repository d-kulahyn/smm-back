import { Permission } from '../enums/permission.enum';
import { Project } from '../../domain/entities/project.entity';
export interface AuthUser {
    id: string;
    email: string;
    role: string;
    permissions: Permission[];
    hasPermission(permission: Permission): boolean;
    hasAnyPermission(permissions: Permission[]): boolean;
    hasAllPermissions(permissions: Permission[]): boolean;
    isAdmin(): boolean;
    isClient(): boolean;
}
export declare class ProjectPolicy {
    viewAny(user: AuthUser): boolean;
    view(user: AuthUser, project: Project): boolean;
    create(user: AuthUser): boolean;
    update(user: AuthUser, project: Project): boolean;
    delete(user: AuthUser, project: Project): boolean;
    manageMembers(user: AuthUser, project: Project): boolean;
    private isUserAssignedToProject;
    private canUserManageProjectMembers;
}
