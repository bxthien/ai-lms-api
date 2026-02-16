import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS for Beginners' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'Học NestJS từ cơ bản đến nâng cao',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.BEGINNER })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 'https://example.com/course-thumbnail.png',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
