import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  listCourses() {
    // TODO: implement list courses
    return this.coursesService.placeholder();
  }
}
