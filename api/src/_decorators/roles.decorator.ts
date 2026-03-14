import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@shared/user.type";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
