import { Controller, Post } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  enroll() {
    // TODO: implement enroll course
    return this.enrollmentsService.placeholder();
  }
}
