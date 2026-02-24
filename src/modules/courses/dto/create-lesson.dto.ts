import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Giới thiệu NestJS' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ example: 'Nội dung bài học...' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ example: 1, description: 'Thứ tự bài học trong khóa' })
  @IsInt()
  @Min(0)
  orderIndex: number;

  @ApiProperty({ example: 15, description: 'Thời lượng (phút)' })
  @IsInt()
  @Min(0)
  duration: number;
}
