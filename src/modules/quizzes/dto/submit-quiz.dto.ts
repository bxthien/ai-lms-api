import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitAnswerDto {
  @ApiProperty({ example: 'uuid-question-id' })
  @IsString()
  @MinLength(5)
  questionId: string;

  @ApiProperty({ example: 'MVC', description: 'Câu trả lời của học viên' })
  @IsString()
  @MinLength(1)
  answer: string;
}

export class SubmitQuizDto {
  @ApiProperty({
    example: 'uuid-quiz-id',
    description: 'ID của quiz cần nộp',
  })
  @IsString()
  @MinLength(5)
  quizId: string;

  @ApiProperty({
    type: [SubmitAnswerDto],
    description: 'Danh sách câu trả lời cho từng câu hỏi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}

