import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {
  placeholder() {
    return { message: 'courses placeholder' };
  }
}
