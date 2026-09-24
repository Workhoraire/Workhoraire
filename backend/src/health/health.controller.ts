import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../prisma/prisma.service';

/** Liveness probe of the container: the API answers and reaches its database. */
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth(): Promise<{ status: 'ok' }> {
    if (!(await this.prisma.isReachable())) {
      throw new ServiceUnavailableException('The database is unreachable');
    }
    return { status: 'ok' };
  }
}
