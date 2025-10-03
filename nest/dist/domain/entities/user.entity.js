"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const role_enum_1 = require("../../shared/enums/role.enum");
class User {
    constructor(id, email, _password, name, role, avatar, isActive = true, emailVerifiedAt, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.email = email;
        this._password = _password;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
        this.isActive = isActive;
        this.emailVerifiedAt = emailVerifiedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    get password() {
        return this._password;
    }
    updatePassword(newPassword) {
        this._password = newPassword;
    }
    isEmailVerified() {
        return !!this.emailVerifiedAt;
    }
    deactivate() {
        return new User(this.id, this.email, this._password, this.name, this.role, this.avatar, false, this.emailVerifiedAt, this.createdAt, new Date());
    }
    get permissions() {
        return role_enum_1.RolePermissions[this.role] || [];
    }
    hasPermission(permission) {
        return this.permissions.includes(permission);
    }
    hasAnyPermission(permissions) {
        return permissions.some(permission => this.permissions.includes(permission));
    }
    hasAllPermissions(permissions) {
        return permissions.every(permission => this.permissions.includes(permission));
    }
    isAdmin() {
        return this.role === role_enum_1.Role.ADMIN;
    }
    isClient() {
        return this.role === role_enum_1.Role.CLIENT;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map