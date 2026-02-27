import { Module } from '@nestjs/common';
import { AiQueueService } from './queue.service';

@Module({
  providers: [
    {
      provide: 'AI_QUEUE',
      useValue: {
        // Dummy implementation: không làm gì, tránh kết nối Redis
        add: async () => undefined,
      },
    },
    AiQueueService,
  ],
  exports: ['AI_QUEUE', AiQueueService],
})
export class QueueModule {}
