import { ApiProperty } from '@nestjs/swagger';

export class QueuedResponseDto {
  @ApiProperty({
    example: 'queued',
    description: 'Job đã được đưa vào queue xử lý bất đồng bộ',
  })
  status: string;
}
