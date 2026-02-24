import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    enum: QuestionType,
    example: QuestionType.MCQ,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    example: 'NestJS dùng pattern nào cho kiến trúc?',
  })
  @IsString()
  @MinLength(5)
  content: string;

  @ApiProperty({
    example: 'MVC',
    description: 'Đáp án đúng cho MCQ (để auto grading)',
    required: false,
  })
  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @ApiProperty({ example: 1, description: 'Điểm cho câu hỏi' })
  @IsNumber()
  @Min(0)
  score: number;
}
