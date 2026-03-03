import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiRequestRepository } from './repositories/ai-request.repository';

@Module({
  controllers: [AiController],
  providers: [AiService, AiRequestRepository],
  exports: [AiRequestRepository],
})
export class AiModule {}
