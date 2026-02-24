import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { EnrollmentsService } from './enrollments.service';
import { EnrollDto } from './dto/enroll.dto';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ghi danh vào khóa học (body: courseId)' })
  @ApiResponse({ status: 201, description: 'Ghi danh thành công' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  enroll(@CurrentUser() user: { userId: string }, @Body() body: EnrollDto) {
    return this.enrollmentsService.enroll(user.userId, body.courseId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách khóa học mà user đã ghi danh' })
  listMyEnrollments(@CurrentUser() user: { userId: string }) {
    return this.enrollmentsService.listMyEnrollments(user.userId);
  }

  @Get('me/:courseId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Thông tin ghi danh của user cho một khóa học cụ thể',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  getMyEnrollment(
    @CurrentUser() user: { userId: string },
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.getMyEnrollmentForCourse(
      user.userId,
      courseId,
    );
  }
}
