import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async updateEmail(userId: string, email: string): Promise<void> {
    await this.prisma.user.update({ where: { id: userId }, data: { email } });
  }

  findByKeycloakSubject(keycloakSubject: string): Promise<ApplicationUser | null> {
    return this.prisma.user.findUnique({
      where: { keycloakSubject },
      include: { company: true },
    });
  }
}
