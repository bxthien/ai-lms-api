import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizzesService {
  placeholder() {
    return { message: 'quizzes placeholder' };
  }
}
