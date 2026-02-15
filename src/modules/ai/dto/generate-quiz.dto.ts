import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateQuizDto {
  @ApiProperty({ description: 'Nội dung bài học dùng để sinh câu hỏi' })
  lessonContent: string;

  @ApiPropertyOptional({ description: 'Tiêu đề bài học' })
  lessonTitle?: string;

  @ApiPropertyOptional({ default: 'vi' })
  language?: string;

  @ApiPropertyOptional({ default: 5, description: 'Số câu hỏi cần sinh' })
  questionCount?: number;
}
