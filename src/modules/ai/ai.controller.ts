import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';
import { GradeEssayDto } from './dto/grade-essay.dto';
import { QueuedResponseDto } from './dto/queued-response.dto';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-quiz')
  @ApiOperation({ summary: 'Sinh quiz từ nội dung bài học (async queue)' })
  @ApiResponse({
    status: 200,
    description: 'Job đã vào queue',
    type: QueuedResponseDto,
  })
  async generateQuiz(@Body() dto: GenerateQuizDto) {
    return this.aiService.generateQuiz(dto);
  }

  @Post('grade-essay')
  @ApiOperation({ summary: 'Chấm bài luận bằng AI (async queue)' })
  @ApiResponse({
    status: 200,
    description: 'Job đã vào queue',
    type: QueuedResponseDto,
  })
  async gradeEssay(@Body() dto: GradeEssayDto) {
    return this.aiService.gradeEssay(dto);
  }
}
