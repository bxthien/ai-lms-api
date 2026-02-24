import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, QueueOptions } from 'bullmq';
import { AiQueueService } from './queue.service';

@Module({
  // providers: [
  //   {
  //     provide: 'AI_QUEUE',
  //     inject: [ConfigService],
  //     useFactory: (config: ConfigService) => {
  //       const host = config.get<string>('REDIS_HOST', 'localhost');
  //       const port = config.get<number>('REDIS_PORT', 6379);
  //       const password = config.get<string>('REDIS_PASSWORD') || undefined;

  //       const connection: QueueOptions['connection'] = {
  //         host,
  //         port,
  //         password,
  //       };

  //       return new Queue('ai-jobs', { connection });
  //     },
  //   },
  //   AiQueueService,
  // ],
  exports: ['AI_QUEUE', AiQueueService],
})
export class QueueModule {}
