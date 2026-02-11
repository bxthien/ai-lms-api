import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-quiz')
  async generateQuiz(@Body() body: any) {
    return this.aiService.generateQuiz(body);
  }

  @Post('grade-essay')
  async gradeEssay(@Body() body: any) {
    return this.aiService.gradeEssay(body);
  }
}
