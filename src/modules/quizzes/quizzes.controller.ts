import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Danh sách quiz theo lesson' })
  listQuizzesByLesson(@Param('lessonId') lessonId: string) {
    return this.quizzesService.listByLesson(lessonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết quiz (kèm danh sách câu hỏi)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  getQuiz(@Param('id') id: string) {
    return this.quizzesService.getQuizWithQuestions(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher tạo quiz cho một lesson' })
  @ApiResponse({ status: 201 })
  createQuiz(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateQuizDto,
  ) {
    return this.quizzesService.createQuizForLesson(user.userId, dto);
  }

  @Post(':quizId/questions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Teacher thêm câu hỏi cho quiz' })
  addQuestion(
    @Param('quizId') quizId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateQuestionDto,
  ) {
    return this.quizzesService.addQuestionToQuiz(user.userId, quizId, dto);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Học viên nộp bài quiz (auto grade MCQ, lưu toàn bộ câu trả lời dạng JSON)',
  })
  @ApiResponse({ status: 201 })
  submitQuiz(
    @Param('id') quizId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizzesService.submitQuiz(user.userId, {
      ...dto,
      quizId,
    });
  }
}
