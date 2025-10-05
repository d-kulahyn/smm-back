import { Permission } from '../enums/permission.enum';
export declare const PERMISSIONS_KEY = "permissions";
export declare const Permissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const REQUIRE_ANY_PERMISSION_KEY = "require_any_permission";
export declare const RequireAnyPermission: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const REQUIRE_ALL_PERMISSIONS_KEY = "require_all_permissions";
export declare const RequireAllPermissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
