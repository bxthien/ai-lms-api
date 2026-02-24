import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  // Tạm thời disable queue/Redis – chỉ trả về stub.

  async generateQuiz(_jobPayload: unknown) {
    return { status: 'disabled' };
  }

  async gradeEssay(_jobPayload: unknown) {
    return { status: 'disabled' };
  }
}
