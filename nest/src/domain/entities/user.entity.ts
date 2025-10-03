import { Permission } from '../../shared/enums/permission.enum';
import { Role, RolePermissions } from '../../shared/enums/role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private _password: string,
    public readonly name: string,
    public readonly role: string,
    public readonly avatar?: string,
    public readonly isActive: boolean = true,
    public readonly emailVerifiedAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  get password(): string {
    return this._password;
  }

  updatePassword(newPassword: string): void {
    this._password = newPassword;
  }

  isEmailVerified(): boolean {
    return !!this.emailVerifiedAt;
  }

  deactivate(): User {
    return new User(
      this.id,
      this.email,
      this._password,
      this.name,
      this.role,
      this.avatar,
      false,
      this.emailVerifiedAt,
      this.createdAt,
      new Date(),
    );
  }

  get permissions(): Permission[] {
    return RolePermissions[this.role as Role] || [];
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.permissions.includes(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.permissions.includes(permission));
  }

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  isClient(): boolean {
    return this.role === Role.CLIENT;
  }
}
