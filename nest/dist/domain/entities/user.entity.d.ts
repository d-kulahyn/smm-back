import { Permission } from '../../shared/enums/permission.enum';
export declare class User {
    readonly id: string;
    readonly email: string;
    private _password;
    readonly name: string;
    readonly role: string;
    readonly avatar?: string;
    readonly isActive: boolean;
    readonly emailVerifiedAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, email: string, _password: string, name: string, role: string, avatar?: string, isActive?: boolean, emailVerifiedAt?: Date, createdAt?: Date, updatedAt?: Date);
    get password(): string;
    updatePassword(newPassword: string): void;
    isEmailVerified(): boolean;
    deactivate(): User;
    get permissions(): Permission[];
    hasPermission(permission: Permission): boolean;
    hasAnyPermission(permissions: Permission[]): boolean;
    hasAllPermissions(permissions: Permission[]): boolean;
    isAdmin(): boolean;
    isClient(): boolean;
}
