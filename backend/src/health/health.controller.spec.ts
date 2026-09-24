import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('is healthy only while the database answers', async () => {
    const isReachable = jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const controller = new HealthController({ isReachable } as unknown as PrismaService);

    await expect(controller.getHealth()).resolves.toEqual({ status: 'ok' });
    await expect(controller.getHealth()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
