import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums/permission.enum';
import { Role, RolePermissions } from '../enums/role.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const reflector = new Reflector();
    const requiredPermissions = reflector.getAllAndOverride<Permission[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const userPermissions = this.getUserPermissions(user);

    if (requiredPermissions.some(permission => userPermissions.includes(permission))) {
      return true;
    }

    const anyPermissions = reflector.get<Permission[]>('any-permissions', context.getHandler());
    if (anyPermissions) {
      return anyPermissions.some(permission => userPermissions.includes(permission));
    }

    const allPermissions = reflector.get<Permission[]>('all-permissions', context.getHandler());
    if (allPermissions) {
      return allPermissions.every(permission => userPermissions.includes(permission));
    }

    return false;
  }

  private getUserPermissions(user: any): Permission[] {
    if (Array.isArray(user.permissions)) {
      return user.permissions;
    }

    const userRole = user.role as Role;
    return RolePermissions[userRole] || [];
  }
}
