import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);

export const REQUIRE_ANY_PERMISSION_KEY = 'require_any_permission';
export const RequireAnyPermission = (...permissions: Permission[]) => SetMetadata(REQUIRE_ANY_PERMISSION_KEY, permissions);

export const REQUIRE_ALL_PERMISSIONS_KEY = 'require_all_permissions';
export const RequireAllPermissions = (...permissions: Permission[]) => SetMetadata(REQUIRE_ALL_PERMISSIONS_KEY, permissions);
