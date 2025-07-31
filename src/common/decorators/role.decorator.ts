// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const PublicAccess = () => SetMetadata('isPublic', true);
export const AllUsers = () =>
  SetMetadata(ROLES_KEY, [
    Role.User,
    Role.Moderator,
    Role.Admin,
    Role.SuperAdmin,
  ]);
export const UserOnly = () => SetMetadata(ROLES_KEY, [Role.User]);
export const ModeratorOnly = () => SetMetadata(ROLES_KEY, [Role.Moderator]);
export const AdminOnly = () => SetMetadata(ROLES_KEY, [Role.Admin]);
export const AdminOrModerator = () =>
  SetMetadata(ROLES_KEY, [Role.Admin, Role.Moderator]);
export const AdminOrSuperAdmin = () =>
  SetMetadata(ROLES_KEY, [Role.Admin, Role.SuperAdmin]);
export const SuperAdminOnly = () => SetMetadata(ROLES_KEY, [Role.SuperAdmin]);
