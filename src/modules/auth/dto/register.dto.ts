import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'student@example.com' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Tối thiểu 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  fullName: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.STUDENT })
  role?: UserRole;
}
