import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class EnrollDto {
  @ApiProperty({
    example: 'uuid-course-id',
    description: 'ID của khóa học cần ghi danh',
  })
  @IsString()
  @MinLength(5)
  courseId: string;
}
