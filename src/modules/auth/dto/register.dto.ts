import { UserRole } from '@prisma/client';

export class RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}
