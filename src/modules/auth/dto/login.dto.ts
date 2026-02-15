import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student@example.com', description: 'Email đăng nhập' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (tối thiểu 6 ký tự)' })
  password: string;
}
