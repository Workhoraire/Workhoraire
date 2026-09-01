import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('resolves the application user by the authenticated Keycloak subject', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 'user-1',
      keycloakSubject: 'subject-1',
      isActive: true,
      company: { id: 'company-1', name: 'Acme' },
    });
    const prisma = {
      user: { findUnique },
    } as unknown as PrismaService;
    const service = new AuthService(prisma);

    await service.findByKeycloakSubject('subject-1');

    expect(findUnique).toHaveBeenCalledWith({
      where: { keycloakSubject: 'subject-1' },
      include: { company: true },
    });
  });
});
