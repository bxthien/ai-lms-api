import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GradeEssayDto {
  @ApiProperty({ description: 'Nội dung câu hỏi' })
  question: string;

  @ApiProperty({ description: 'Câu trả lời của học viên' })
  answer: string;

  @ApiPropertyOptional({ description: 'Tiêu chí chấm (rubric)' })
  rubric?: string;

  @ApiPropertyOptional({ default: 10 })
  maxScore?: number;

  @ApiPropertyOptional({ default: 'vi' })
  language?: string;
}
