import { Injectable } from '@nestjs/common';
import { AiQueueService } from '../../queue/queue.service';

@Injectable()
export class AiService {
  constructor(private readonly aiQueue: AiQueueService) {}

  async generateQuiz(jobPayload: unknown) {
    await this.aiQueue.enqueueGenerateQuiz(jobPayload);
    return { status: 'queued' };
  }

  async gradeEssay(jobPayload: unknown) {
    await this.aiQueue.enqueueGradeEssay(jobPayload);
    return { status: 'queued' };
  }
}
