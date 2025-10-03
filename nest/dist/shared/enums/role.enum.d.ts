import { Permission } from './permission.enum';
export declare enum Role {
    ADMIN = "admin",
    CLIENT = "client",
    CHAT_MEMBER = "chat_member"
}
export declare const RoleLabels: Record<Role, string>;
export declare const RolePermissions: Record<Role, Permission[]>;
