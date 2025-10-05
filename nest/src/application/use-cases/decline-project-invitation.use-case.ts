import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PrismaProjectInvitationRepository } from '../../infrastructure/repositories/prisma-project-invitation.repository';
import { InvitationStatus } from '@prisma/client';

@Injectable()
export class DeclineProjectInvitationUseCase {
  constructor(
    @Inject('PROJECT_INVITATION_REPOSITORY')
    private readonly invitationRepository: PrismaProjectInvitationRepository
  ) {}

  async execute(token: string): Promise<{ message: string }> {
    const invitation = await this.invitationRepository.findByToken(token);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.pending) {
      throw new BadRequestException('Invitation is no longer valid');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    // Обновляем статус приглашения
    await this.invitationRepository.updateStatus(
      token,
      InvitationStatus.declined
    );

    return { message: 'Invitation declined successfully' };
  }
}
