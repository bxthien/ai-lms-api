import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách quiz (filter theo lesson/course)' })
  listQuizzes() {
    return this.quizzesService.placeholder();
  }
}
