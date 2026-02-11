import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AiQueueService {
  constructor(@Inject('AI_QUEUE') private readonly queue: Queue) {}

  async enqueueGenerateQuiz(payload: unknown) {
    await this.queue.add('generate-quiz', payload);
  }

  async enqueueGradeEssay(payload: unknown) {
    await this.queue.add('grade-essay', payload);
  }
}
