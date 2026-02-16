import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'URL ảnh đại diện',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

