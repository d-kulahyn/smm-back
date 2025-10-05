"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAllPermissions = exports.REQUIRE_ALL_PERMISSIONS_KEY = exports.RequireAnyPermission = exports.REQUIRE_ANY_PERMISSION_KEY = exports.Permissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const Permissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.Permissions = Permissions;
exports.REQUIRE_ANY_PERMISSION_KEY = 'require_any_permission';
const RequireAnyPermission = (...permissions) => (0, common_1.SetMetadata)(exports.REQUIRE_ANY_PERMISSION_KEY, permissions);
exports.RequireAnyPermission = RequireAnyPermission;
exports.REQUIRE_ALL_PERMISSIONS_KEY = 'require_all_permissions';
const RequireAllPermissions = (...permissions) => (0, common_1.SetMetadata)(exports.REQUIRE_ALL_PERMISSIONS_KEY, permissions);
exports.RequireAllPermissions = RequireAllPermissions;
//# sourceMappingURL=permissions.decorator.js.map