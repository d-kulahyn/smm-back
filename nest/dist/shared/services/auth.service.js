"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../enums/role.enum");
let AuthService = class AuthService {
    createAuthUser(user) {
        return {
            id: user.userId || user.id,
            email: user.email,
            role: user.role,
            permissions: user.permissions || role_enum_1.RolePermissions[user.role] || [],
            hasPermission: function (permission) {
                return this.permissions.includes(permission);
            },
            hasAnyPermission: function (permissions) {
                return permissions.some(permission => this.permissions.includes(permission));
            },
            hasAllPermissions: function (permissions) {
                return permissions.every(permission => this.permissions.includes(permission));
            },
            isAdmin: function () {
                return this.role === role_enum_1.Role.ADMIN;
            },
            isClient: function () {
                return this.role === role_enum_1.Role.CLIENT;
            }
        };
    }
    hasPermission(user, permission) {
        const authUser = this.createAuthUser(user);
        return authUser.hasPermission(permission);
    }
    hasAnyPermission(user, permissions) {
        const authUser = this.createAuthUser(user);
        return authUser.hasAnyPermission(permissions);
    }
    getUserPermissions(user) {
        const userRole = user.role;
        return role_enum_1.RolePermissions[userRole] || [];
    }
    assignDefaultRoleToNewUser() {
        const role = role_enum_1.Role.CLIENT;
        const permissions = role_enum_1.RolePermissions[role];
        return {
            role,
            permissions
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map