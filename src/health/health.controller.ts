import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Kiểm tra DB và dịch vụ' })
  async check() {
    const dbCheck: HealthIndicatorResult = {
      database: {
        status: 'up',
      },
    };

    await this.prisma.$queryRaw`SELECT 1`;

    return this.health.check([async () => dbCheck]);
  }
}
