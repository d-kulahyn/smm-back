import { Permission } from '../enums/permission.enum';
import { Role } from '../enums/role.enum';
import { AuthUser } from '../policies/project.policy';
export declare class AuthService {
    createAuthUser(user: any): AuthUser;
    hasPermission(user: any, permission: Permission): boolean;
    hasAnyPermission(user: any, permissions: Permission[]): boolean;
    getUserPermissions(user: any): Permission[];
    assignDefaultRoleToNewUser(): {
        role: Role;
        permissions: Permission[];
    };
}
