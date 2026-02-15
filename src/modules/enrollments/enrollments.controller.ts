import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Ghi danh vào khóa học (body: courseId)' })
  enroll() {
    return this.enrollmentsService.placeholder();
  }
}
