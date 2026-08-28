import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  findByKeycloakSubject(keycloakSubject: string): Promise<ApplicationUser | null> {
    return this.prisma.user.findUnique({
      where: { keycloakSubject },
      include: { company: true },
    });
  }
}
