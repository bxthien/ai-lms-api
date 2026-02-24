import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ example: 'Quiz chương 1' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'uuid-lesson-id',
    description: 'ID của lesson mà quiz thuộc về',
  })
  @IsString()
  @MinLength(5)
  lessonId: string;
}
